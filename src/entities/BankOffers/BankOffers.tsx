import { forwardRef } from 'react'

import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { CalculatedProduct } from '@sberauto/dictionarydc-proto/public'

import { BANK_OFFERS_TABLE_HEADERS } from './BankOffers.config'
import useStyles from './BankOffers.styles'
import { getCellsChildren } from './BankOffers.utils'
import { ButtonsCell } from './ButtonsCell/ButtonsCell'

type Props = {
  data: CalculatedProduct[]
  onRowClick: (creditProduct: CalculatedProduct) => void
}

export const BankOffers = forwardRef(({ data, onRowClick }: Props, ref) => {
  const classes = useStyles()

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
                    onClick={cell.type === 'icon' ? () => null : () => onRowClick(row)}
                  >
                    {cell.type === 'icon' ? <ButtonsCell type={cell.name} /> : <>{cell.value}</>}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Box>
  )
})
