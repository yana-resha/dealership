import React, { useEffect, useState } from 'react'

import { Box } from '@mui/material'

import { getStatus, PreparedStatus } from '../../../entities/application/application.utils'
import {
  getMockedClientDossier,
  getMockQuestionnaire,
} from '../../../entities/application/DossierAreas/__tests__/mocks/clientDetailedDossier.mock'
import { ActionArea } from '../../../entities/application/DossierAreas/ActionArea/ActionArea'
import { DocumentsArea } from '../../../entities/application/DossierAreas/DocumentsArea/DocumentsArea'
import { DossierIdArea } from '../../../entities/application/DossierAreas/DossierIdArea/DossierIdArea'
import { InformationArea } from '../../../entities/application/DossierAreas/InformationArea/InformationArea'
import { useStyles } from './ClientDetailedDossier.styles'

type Props = {
  applicationId: string
  onBackButton: () => void
}

export function ClientDetailedDossier(props: Props) {
  const classes = useStyles()
  const { applicationId, onBackButton } = props
  const clientDossier = getMockedClientDossier(applicationId)
  const status = clientDossier ? getStatus(clientDossier.status) : PreparedStatus.error
  const [fileQuestionnaire, setFileQuestionnaire] = useState<File>()

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      const questionnaire = await getMockQuestionnaire(applicationId)
      if (questionnaire) {
        setFileQuestionnaire(questionnaire)
      }
    }
    fetchQuestionnaire()
  }, [])

  return (
    <Box className={classes.pageContainer}>
      <DossierIdArea clientDossier={clientDossier} onBackButton={onBackButton} />
      <Box className={classes.dossierContainer}>
        <InformationArea clientDossier={clientDossier} />
        <DocumentsArea
          fileQuestionnaire={fileQuestionnaire}
          setQuestionnaire={setFileQuestionnaire}
          status={status}
        />
        <ActionArea status={status} fileQuestionnaire={fileQuestionnaire} />
      </Box>
    </Box>
  )
}
