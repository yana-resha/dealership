import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'

import { DateCellType } from '../DateFilter.types'
import { DateCell } from './DateCell/DateCell'

const useStyles = makeStyles(() => ({
  row: {
    display: 'flex',
  },
}))

export const DateRow = ({
  values,
  onCellClicked,
}: {
  values: DateCellType[]
  onCellClicked: (day?: string) => void
}) => {
  const classes = useStyles()

  return (
    <Box className={classes.row} gridTemplateColumns="repeat(7, 1fr)">
      {values.map((v, index) => (
        <DateCell key={`${v?.label}${index}`} data={v} onCellClicked={onCellClicked} />
      ))}
    </Box>
  )
}
