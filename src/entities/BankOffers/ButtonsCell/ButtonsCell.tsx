import { Box, IconButton, Tooltip } from '@mui/material'

import { ReactComponent as ConfirmationDocumentIcon } from 'assets/icons/confirmationDocument.svg'
import { ReactComponent as ScheduleIcon } from 'assets/icons/schedule.svg'

import useStyles from './ButtonsCell.styles'

export const ButtonsCell = () => {
  const classes = useStyles()

  return (
    <Box className={classes.btnContainer}>
      <IconButton size="small" className={classes.icon} onClick={() => null}>
        <ScheduleIcon />
      </IconButton>
      <Tooltip
        arrow
        title={<span>Требуется справка подтверждающая доход</span>}
        classes={{ tooltip: classes.tooltip, arrow: classes.tooltipArrow }}
      >
        <ConfirmationDocumentIcon className={classes.icon} />
      </Tooltip>
    </Box>
  )
}
