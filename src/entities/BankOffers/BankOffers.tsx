import { forwardRef, useCallback } from 'react'

import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { CalculatedProduct } from '@sberauto/dictionarydc-proto/public'

import { ReactComponent as ScheduleIcon } from 'assets/icons/schedule.svg'
import { useGetPreliminaryPaymentScheduleFormMutation } from 'shared/api/requests/loanAppLifeCycleDc'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { Downloader } from 'shared/ui/Downloader'

import { BANK_OFFERS_TABLE_HEADERS, TableCellKey, TableCellType } from './BankOffers.config'
import useStyles from './BankOffers.styles'
import { getCellsChildren } from './BankOffers.utils'
import { ButtonsCell } from './ButtonsCell/ButtonsCell'

type Props = {
  data: CalculatedProduct[]
  onRowClick: (creditProduct: CalculatedProduct) => void
}

export const BankOffers = forwardRef(({ data, onRowClick }: Props, ref) => {
  const classes = useStyles()
  const autoPrice = useAppSelector(state => state.order.order?.orderData?.application?.loanCar?.autoPrice)

  const { mutateAsync: getPreliminaryPaymentScheduleFormMutate } =
    useGetPreliminaryPaymentScheduleFormMutation()

  const handleAttachmentClick = useCallback(
    async (row: CalculatedProduct) => {
      const blob = await getPreliminaryPaymentScheduleFormMutate({
        productName: row.productName,
        incomeFlag: row.incomeFlag,
        autoPrice: autoPrice,
        rate: row.currentRate,
        downpayment: row.downpayment,
        monthlyPayment: row.monthlyPayment,
        term: row.term,
        overpayment: row.overpayment,
        servicesInCreditPrice: row.servicesInCreditPrice,
        equipmentInCreditPrice: row.equipmentInCreditPrice,
      })

      if (blob) {
        return new File([blob], 'График платежей', { type: 'application/pdf' })
      }
    },
    [autoPrice, getPreliminaryPaymentScheduleFormMutate],
  )

  return (
    <Box className={classes.container} ref={ref}>
      <Typography className={classes.title}>Предложение от банка</Typography>
      <Table size="small" data-testid="bankOffersTable" className={classes.tableContainer}>
        <TableHead>
          <TableRow className={classes.headerRow}>
            {BANK_OFFERS_TABLE_HEADERS.map(header => (
              <TableCell align="left" key={header.key} className={classes.headerCell}>
                {header.label?.toUpperCase()}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {!!data &&
            data.map(row => (
              <TableRow key={row.productId} className={classes.bodyRow}>
                {getCellsChildren(row).map(cell => (
                  <TableCell
                    key={cell.name}
                    align="left"
                    className={classes.bodyCell}
                    onClick={cell.type === TableCellType.Icon ? () => null : () => onRowClick(row)}
                  >
                    <>
                      {cell.type === TableCellType.Icon && cell.name === TableCellKey.IncomeFlag && (
                        <ButtonsCell />
                      )}

                      {cell.type === TableCellType.Icon && cell.name === TableCellKey.Attachment && (
                        <Downloader onDownloadFile={async () => await handleAttachmentClick(row)}>
                          <ScheduleIcon />
                        </Downloader>
                      )}

                      {cell.type !== TableCellType.Icon && cell.value}
                    </>
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Box>
  )
})
