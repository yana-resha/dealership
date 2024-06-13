import { useCallback } from 'react'

import { TableCell, TableRow } from '@mui/material'
import { CalculatedProduct } from '@sberauto/dictionarydc-proto/public'
import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'

import { ReactComponent as ScheduleIcon } from 'assets/icons/schedule.svg'
import { useGetPreliminaryPaymentScheduleFormMutation } from 'shared/api/requests/loanAppLifeCycleDc'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { Downloader } from 'shared/ui/Downloader'
import { transformFileName } from 'shared/utils/fileLoading'

import { HeaderCellKey, TableCellType } from '../BankOffers.config'
import { getCellsChildren } from '../BankOffers.utils'
import useStyles from './BodyRow.styles'
import { ButtonsCell } from './ButtonsCell/ButtonsCell'

type Props = {
  row: CalculatedProduct
  onClick: (creditProduct: CalculatedProduct) => void
}

export const BodyRow = ({ row, onClick }: Props) => {
  const classes = useStyles()
  const autoPrice = useAppSelector(state => state.order.order?.orderData?.application?.loanCar?.autoPrice)
  const dcAppId = useAppSelector(state => state.order.order?.orderData?.application?.dcAppId)

  const {
    mutateAsync: getPreliminaryPaymentScheduleFormMutate,
    isLoading: isGetPreliminaryPaymentScheduleFormLoading,
  } = useGetPreliminaryPaymentScheduleFormMutation()

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
        return new File(
          [blob],
          transformFileName(DocumentType.ESTIMATED_FEE_SCHEDULE, dcAppId || '') || 'График платежей',
          { type: blob.type },
        )
      }
    },
    [autoPrice, dcAppId, getPreliminaryPaymentScheduleFormMutate],
  )

  return (
    <TableRow key={row.productId} className={classes.bodyRow}>
      {getCellsChildren(row).map(cell => (
        <TableCell
          key={cell.name}
          align="left"
          className={classes.bodyCell}
          onClick={cell.type === TableCellType.Icon ? () => null : () => onClick(row)}
        >
          <>
            {cell.type === TableCellType.Icon && cell.name === HeaderCellKey.IncomeFlag && <ButtonsCell />}

            {cell.type === TableCellType.Icon && cell.name === HeaderCellKey.Attachment && (
              <Downloader
                onDownloadFile={async () => await handleAttachmentClick(row)}
                disabled={isGetPreliminaryPaymentScheduleFormLoading}
              >
                <ScheduleIcon />
              </Downloader>
            )}

            {cell.type !== TableCellType.Icon && cell.value}
          </>
        </TableCell>
      ))}
    </TableRow>
  )
}
