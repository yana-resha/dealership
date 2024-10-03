import { Box } from '@mui/material'

import SberTypography from 'shared/ui/SberTypography'

import { useStyles } from './HeaderRow.styles'

const CONFIG = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export const HeaderRow = () => {
  const classes = useStyles()

  return (
    <Box className={classes.row} gridTemplateColumns="repeat(7, 1fr)">
      {CONFIG.map(v => (
        <Box key={v} className={classes.header}>
          <SberTypography component="div" sberautoVariant="body5">
            {v}
          </SberTypography>
        </Box>
      ))}
    </Box>
  )
}
