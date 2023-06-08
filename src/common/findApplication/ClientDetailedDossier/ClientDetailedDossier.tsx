import { useEffect, useState } from 'react'

import { Box } from '@mui/material'
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { getStatus, PreparedStatus } from 'entities/application/application.utils'
import {
  ClientDossier,
  getMockedClientDossier,
  getMockQuestionnaire,
} from 'entities/application/DossierAreas/__tests__/mocks/clientDetailedDossier.mock'
import {
  ActionArea,
  DocumentsArea,
  DossierIdArea,
  EditRequisitesArea,
  InformationArea,
} from 'entities/application/DossierAreas/ui'

import { useStyles } from './ClientDetailedDossier.styles'

type Props = {
  applicationId: string
  onBackButton: () => void
}

export function ClientDetailedDossier(props: Props) {
  const classes = useStyles()
  const { applicationId, onBackButton } = props
  const [clientDossier, setClientDossier] = useState<ClientDossier>(getMockedClientDossier(applicationId))
  const [status, setStatus] = useState(clientDossier ? getStatus(clientDossier.status) : PreparedStatus.error)
  const [fileQuestionnaire, setFileQuestionnaire] = useState<File>()
  const [agreementDocs, setAgreementDocs] = useState<(File | undefined)[]>([])
  const [isEditRequisitesMode, setIsEditRequisitesMode] = useState(false)

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      const questionnaire = await getMockQuestionnaire(applicationId)
      if (questionnaire) {
        setFileQuestionnaire(questionnaire)
      }
    }
    if (!isEditRequisitesMode) {
      fetchQuestionnaire()
    }
  }, [])

  function updateStatus(statusCode: StatusCode) {
    //sendRequest
    setClientDossier(prev => ({ ...prev, status: statusCode }))
    setStatus(getStatus(statusCode))
  }

  return (
    <Box>
      {isEditRequisitesMode ? (
        <EditRequisitesArea clientDossier={clientDossier} changeRequisites={setIsEditRequisitesMode} />
      ) : (
        <Box className={classes.pageContainer}>
          <DossierIdArea clientDossier={clientDossier} onBackButton={onBackButton} />
          <Box className={classes.dossierContainer}>
            <InformationArea clientDossier={clientDossier} />
            <DocumentsArea
              fileQuestionnaire={fileQuestionnaire}
              setQuestionnaire={setFileQuestionnaire}
              agreementDocs={agreementDocs}
              setAgreementDocs={setAgreementDocs}
              status={status}
            />
            <ActionArea
              clientDossier={clientDossier}
              updateStatus={updateStatus}
              fileQuestionnaire={fileQuestionnaire}
              agreementDocs={agreementDocs}
              setAgreementDocs={setAgreementDocs}
              setIsEditRequisitesMode={setIsEditRequisitesMode}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}
