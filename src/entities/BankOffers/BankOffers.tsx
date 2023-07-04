import { forwardRef } from 'react'

import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { CalculatedProduct } from '@sberauto/dictionarydc-proto/public'

import { ADDITIONAL_CELL_NAME, BANK_OFFERS_TABLE_HEADERS } from './BankOffers.config'
import useStyles from './BankOffers.styles'
import { getCellsChildrens, prepareData } from './BankOffers.utils'
import { ButtonsCell } from './ButtonsCell/ButtonsCell'

type Props = {
  data: CalculatedProduct[]
  onRowClick: () => void
}

export const BankOffers = forwardRef(({ data, onRowClick }: Props, ref) => {
  const classes = useStyles()
  const preparedData = prepareData(data)

  return (
    <Box className={classes.container} ref={ref}>
      <Typography className={classes.title}>Предложение от банка</Typography>
      <Table size="small" data-testid="bankOffersTable" className={classes.tableContainer}>
        <TableHead>
          <TableRow className={classes.headerRow}>
            {BANK_OFFERS_TABLE_HEADERS.map(header => (
              <TableCell align="left" key={header} className={classes.headerCell}>
                {header.toUpperCase()}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {!!preparedData &&
            preparedData.map(row => (
              <TableRow key={row.productId} className={classes.bodyRow}>
                {getCellsChildrens(row).map(cell => (
                  <TableCell
                    key={cell.name}
                    align="left"
                    className={classes.bodyCell}
                    onClick={cell.name === ADDITIONAL_CELL_NAME ? () => null : onRowClick}
                  >
                    {cell.name === ADDITIONAL_CELL_NAME ? <ButtonsCell /> : <>{cell.value}</>}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Box>
  )
})
