import React from 'react'

import { Box, IconButton, Typography } from '@mui/material'

import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import { convertedDateToString } from 'shared/utils/dateTransform'

import { useStyles } from './EmailInfoArea.styles'

type Props = {
  topic: string | undefined
  from: string | undefined
  receivedAt: string | undefined
  messageId: string | undefined
  onBackButton: () => void
}

export function EmailInfoArea({
  topic = '',
  from = '',
  receivedAt = '',
  messageId = '',
  onBackButton,
}: Props) {
  const classes = useStyles()

  return (
    <Box className={classes.areaContainer}>
      <IconButton className={classes.iconButton} onClick={onBackButton}>
        <KeyboardArrowLeft />
      </IconButton>
      <Box className={classes.infoContainer}>
        <Typography className={classes.emailTopic}>{topic}</Typography>
        <Box className={classes.emailInfo}>
          <Typography className={classes.from}>{from}</Typography>
          {receivedAt && (
            <Typography className={classes.receivedAt}>
              {convertedDateToString(new Date(receivedAt), 'dd.LL.yyyy HH:mm')}
            </Typography>
          )}
          {messageId && <Typography className={classes.messageId}>{messageId}</Typography>}
        </Box>
      </Box>
    </Box>
  )
}
