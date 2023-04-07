import React, { useMemo } from 'react'

import { Box, Button } from '@mui/material'

import { ProgressBar } from 'shared/ui/ProgressBar/ProgressBar'
import SberTypography from 'shared/ui/SberTypography'

import { PreparedStatus } from '../../application.utils'
import { AgreementArea } from '../AgreementArea/AgreementArea'
import { progressBarConfig } from '../configs/clientDetailedDossier.config'
import { useStyles } from './ActionArea.styles'

type Props = {
  status: PreparedStatus
  fileQuestionnaire: File | undefined
}

export function ActionArea(props: Props) {
  const classes = useStyles()
  const { status, fileQuestionnaire } = props
  const showActionsStatuses = [
    PreparedStatus.initial,
    PreparedStatus.approved,
    PreparedStatus.canceled,
    PreparedStatus.canceledDeal,
    PreparedStatus.error,
    PreparedStatus.finallyApproved,
    PreparedStatus.formation,
    PreparedStatus.signed,
  ]

  const shownBlock = useMemo(() => {
    if (status == PreparedStatus.initial) {
      return (
        <Box className={classes.actionButtons}>
          <Button variant="contained">Редактировать</Button>
          {fileQuestionnaire && <Button variant="contained">Отправить на решение</Button>}
        </Box>
      )
    }
    if (status == PreparedStatus.approved) {
      return (
        <Box className={classes.actionButtons}>
          <Button variant="contained">Редактировать</Button>
          <Button variant="contained">Дозаполнить анкету</Button>
        </Box>
      )
    }
    if (status == PreparedStatus.canceled || status == PreparedStatus.canceledDeal) {
      return (
        <Box className={classes.actionButtons}>
          <Button variant="contained">Пересоздать заявку</Button>
        </Box>
      )
    }
    if (status == PreparedStatus.error) {
      return (
        <Box className={classes.actionButtons}>
          <Button variant="contained">Редактировать</Button>
        </Box>
      )
    }
    if (status == PreparedStatus.finallyApproved || status == PreparedStatus.formation) {
      return <AgreementArea status={status} />
    }
    if (status == PreparedStatus.signed) {
      return (
        <Box className={classes.buttonsWithProgressBar}>
          <ProgressBar {...progressBarConfig} currentStep={3} />
          <Box className={classes.actionButtons}>
            <Button variant="contained"> Отправить на финансирование</Button>
          </Box>
        </Box>
      )
    }
  }, [status, fileQuestionnaire])

  return (
    <Box className={classes.blockContainer}>
      {showActionsStatuses.includes(status) && (
        <SberTypography gridColumn="span 6" sberautoVariant="h5" component="p">
          Действие
        </SberTypography>
      )}
      {shownBlock}
    </Box>
  )
}
