import { useCallback } from 'react'

import { Box } from '@mui/material'
import cx from 'classnames'

import SberTypography from 'shared/ui/SberTypography'

import { DateCellType, SelectionType } from '../../DateFilter.types'
import { useStyles } from './DateCell.styles'

type DateCellProps = {
  data: DateCellType
  onCellClicked?: (day?: string) => void
}

export const DateCell = ({ data, onCellClicked = () => {} }: DateCellProps) => {
  const classes = useStyles()
  const { label, selectionType } = data

  const handleCellClicked = useCallback(() => onCellClicked(label), [label, onCellClicked])

  return (
    <Box
      className={cx(classes.cell, {
        [classes.selectedCell]: selectionType === SelectionType.SELECTED,
        [classes.firstCell]: selectionType === SelectionType.FIRST,
        [classes.middleCell]: selectionType === SelectionType.MIDDLE,
        [classes.lastCell]: selectionType === SelectionType.LAST,
        [classes.defaultCell]:
          selectionType !== SelectionType.SELECTED &&
          selectionType !== SelectionType.FIRST &&
          selectionType !== SelectionType.MIDDLE &&
          selectionType !== SelectionType.LAST &&
          !!label,
      })}
      onClick={handleCellClicked}
    >
      <SberTypography key={label} component="div" sberautoVariant="body5">
        {label ?? ''}
      </SberTypography>
    </Box>
  )
}
