import { memo } from 'react'

import NorthIcon from '@mui/icons-material/North'
import SouthIcon from '@mui/icons-material/South'
import { Box, TableCell } from '@mui/material'
import cx from 'classnames'

import { BankOffersTableHeader, HeaderCellKey, SortOrder } from '../BankOffers.config'
import useStyles from './HeaderCell.styles'

type Props = {
  header: BankOffersTableHeader
  sortParams: Map<HeaderCellKey, SortOrder>
  onClick: (headerCell: HeaderCellKey) => void
}

export const HeaderCell = memo(({ header, sortParams, onClick }: Props) => {
  const classes = useStyles()

  const handleCellClick = () => onClick(header.key)

  return (
    <TableCell
      className={cx(classes.headerCell, {
        [classes.shortHeaderCell]: header.key === HeaderCellKey.REQUIRED_SERVICE_FLAG,
      })}
    >
      <Box
        className={cx(classes.headerCellWrapper, {
          [classes.leftAlignHeaderCellWrapper]: header.key === HeaderCellKey.PRODUCT_NAME,
        })}
      >
        <Box
          className={cx(classes.headerCellContainer, {
            [classes.headerCellContainerForSort]: header.isCanSort,
            [classes.sortedHeaderCellContainer]: sortParams.has(header.key),
            [classes.leftAlignHeaderCellContainer]: header.key === HeaderCellKey.PRODUCT_NAME,
          })}
          onClick={header.isCanSort ? handleCellClick : undefined}
        >
          {header.label?.toUpperCase()}
          {sortParams.get(header.key) === SortOrder.ASC && <SouthIcon className={classes.sortIcon} />}
          {sortParams.get(header.key) === SortOrder.DESC && <NorthIcon className={classes.sortIcon} />}
        </Box>
      </Box>
    </TableCell>
  )
})
