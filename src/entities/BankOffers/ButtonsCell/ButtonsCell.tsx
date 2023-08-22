import { FC } from 'react'

import { Box, IconButton } from '@mui/material'

import { ReactComponent as ConfirmationDocumentIcon } from 'assets/icons/confirmationDocument.svg'
import { ReactComponent as ScheduleIcon } from 'assets/icons/schedule.svg'
import { CustomTooltip } from 'shared/ui/CustomTooltip/CustomTooltip'

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
        <CustomTooltip
          arrow
          title={<span style={{ maxWidth: 150 }}>Требуется справка подтверждающая доход</span>}
        >
          <ConfirmationDocumentIcon className={classes.icon} />
        </CustomTooltip>
      )}
    </Box>
  )
}
