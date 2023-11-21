import { Box, Typography } from '@mui/material'

import { useStyles } from './Helpdesk.styles'
import { HelpdeskExample } from './HelpdeskExample/HelpdeskExample'
import { Instruction } from './Instruction/Instruction'

export function Helpdesk() {
  const classes = useStyles()

  return (
    <div className={classes.page} data-testid="helpdesk">
      <Typography className={classes.pageTitle}>Поддержка</Typography>

      <Box className={classes.container}>
        <Instruction />
        <HelpdeskExample />
      </Box>
    </div>
  )
}
