import { useMemo } from 'react'

import { Box, Button } from '@mui/material'
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { ApplicationFrontdc } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import SberTypography from 'shared/ui/SberTypography'

import { AgreementArea } from '../'
import { getStatus, PreparedStatus } from '../../../application.utils'
import { useStyles } from './ActionArea.styles'

type Props = {
  status: StatusCode
  application: ApplicationFrontdc
  updateStatus: (statusCode: StatusCode) => void
  fileQuestionnaire: File | undefined
  agreementDocs: (File | undefined)[]
  setAgreementDocs: (files: (File | undefined)[]) => void
  setIsEditRequisitesMode: (value: boolean) => void
}

export function ActionArea(props: Props) {
  const classes = useStyles()
  const {
    status,
    application,
    updateStatus,
    fileQuestionnaire,
    agreementDocs,
    setAgreementDocs,
    setIsEditRequisitesMode,
  } = props
  const preparedStatus = getStatus(status)
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
    if (preparedStatus == PreparedStatus.initial) {
      return (
        <Box className={classes.actionButtons}>
          <Button variant="contained">Редактировать</Button>
          {fileQuestionnaire && <Button variant="contained">Отправить на решение</Button>}
        </Box>
      )
    }
    if (preparedStatus == PreparedStatus.approved) {
      return (
        <Box className={classes.actionButtons}>
          <Button variant="contained">Редактировать</Button>
          <Button variant="contained">Дозаполнить анкету</Button>
        </Box>
      )
    }
    if (preparedStatus == PreparedStatus.canceled || preparedStatus == PreparedStatus.canceledDeal) {
      return (
        <Box className={classes.actionButtons}>
          <Button variant="contained">Пересоздать заявку</Button>
        </Box>
      )
    }
    if (preparedStatus == PreparedStatus.error) {
      return (
        <Box className={classes.actionButtons}>
          <Button variant="contained">Редактировать</Button>
        </Box>
      )
    }
    if (
      [PreparedStatus.finallyApproved, PreparedStatus.formation, PreparedStatus.signed].includes(
        preparedStatus,
      )
    ) {
      return (
        <AgreementArea
          status={status}
          application={application}
          updateStatus={updateStatus}
          agreementDocs={agreementDocs}
          setAgreementDocs={setAgreementDocs}
          setIsEditRequisitesMode={setIsEditRequisitesMode}
        />
      )
    }
  }, [
    preparedStatus,
    classes.actionButtons,
    fileQuestionnaire,
    status,
    application,
    updateStatus,
    agreementDocs,
    setAgreementDocs,
    setIsEditRequisitesMode,
  ])

  return (
    <Box className={classes.blockContainer}>
      {showActionsStatuses.includes(preparedStatus) && (
        <SberTypography gridColumn="span 6" sberautoVariant="h5" component="p">
          Действие
        </SberTypography>
      )}
      {shownBlock}
    </Box>
  )
}
