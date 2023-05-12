import React, { useMemo } from 'react'

import { Box, Button } from '@mui/material'
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import SberTypography from 'shared/ui/SberTypography'

import { getStatus, PreparedStatus } from '../../application.utils'
import { ClientDossier } from '../__tests__/mocks/clientDetailedDossier.mock'
import { AgreementArea } from '../AgreementArea/AgreementArea'
import { useStyles } from './ActionArea.styles'

type Props = {
  clientDossier: ClientDossier
  updateStatus: (statusCode: StatusCode) => void
  fileQuestionnaire: File | undefined
  agreementDocs: (File | undefined)[]
  setAgreementDocs: (files: (File | undefined)[]) => void
}

export function ActionArea(props: Props) {
  const classes = useStyles()
  const { clientDossier, updateStatus, fileQuestionnaire, agreementDocs, setAgreementDocs } = props
  const status = getStatus(clientDossier.status)
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
    if ([PreparedStatus.finallyApproved, PreparedStatus.formation, PreparedStatus.signed].includes(status)) {
      return (
        <AgreementArea
          clientDossier={clientDossier}
          updateStatus={updateStatus}
          agreementDocs={agreementDocs}
          setAgreementDocs={setAgreementDocs}
        />
      )
    }
  }, [status, fileQuestionnaire, agreementDocs])

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
