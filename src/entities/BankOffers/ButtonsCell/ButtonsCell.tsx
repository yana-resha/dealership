import { FC } from 'react'

import { Box, IconButton, Tooltip } from '@mui/material'

import { ReactComponent as ConfirmationDocumentIcon } from 'assets/icons/confirmationDocument.svg'
import { ReactComponent as ScheduleIcon } from 'assets/icons/schedule.svg'

import useStyles from './ButtonsCell.styles'

type Props = {
  type: string
}

export const ButtonsCell: FC<Props> = ({ type }) => {
  const classes = useStyles()

  return (
    <Box className={classes.btnContainer}>
      {type === 'attachment' && (
        <IconButton size="small" className={classes.icon} onClick={() => null}>
          <ScheduleIcon />
        </IconButton>
      )}
      {type === 'incomeFlag' && (
        <Tooltip
          arrow
          title={<span>Требуется справка подтверждающая доход</span>}
          classes={{ tooltip: classes.tooltip, arrow: classes.tooltipArrow }}
        >
          <ConfirmationDocumentIcon className={classes.icon} />
        </Tooltip>
      )}
    </Box>
  )
}
