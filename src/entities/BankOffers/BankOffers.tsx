import { forwardRef } from 'react'

import { Box, Table, TableBody, TableHead, TableRow, Typography } from '@mui/material'
import { CalculatedProduct } from '@sberauto/dictionarydc-proto/public'

import { BANK_OFFERS_TABLE_HEADERS } from './BankOffers.config'
import useStyles from './BankOffers.styles'
import { BodyRow } from './BodyRow/BodyRow'
import { HeaderCell } from './HeaderCell/HeaderCell'
import { useSortBankOffers } from './useSortBankOffers'

type Props = {
  data: CalculatedProduct[]
  onRowClick: (creditProduct: CalculatedProduct) => void
}

export const BankOffers = forwardRef(({ data, onRowClick }: Props, ref) => {
  const classes = useStyles()

  const { sortParams, sortedData, handleSortBtnClick } = useSortBankOffers(data)

  return (
    <Box className={classes.container} ref={ref}>
      <Typography className={classes.title}>Предложение от банка</Typography>
      <Table size="small" data-testid="bankOffersTable" className={classes.tableContainer}>
        <TableHead>
          <TableRow className={classes.headerRow}>
            {BANK_OFFERS_TABLE_HEADERS.map(header => (
              <HeaderCell
                key={header.key}
                header={header}
                sortParams={sortParams}
                onClick={handleSortBtnClick}
              />
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedData.map(row => (
            <BodyRow key={row.productId || row.productCode} row={row} onClick={onRowClick} />
          ))}
        </TableBody>
      </Table>
    </Box>
  )
})
