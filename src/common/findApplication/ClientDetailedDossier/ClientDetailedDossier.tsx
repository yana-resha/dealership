import { useEffect, useMemo, useState } from 'react'

import { Box, CircularProgress } from '@mui/material'
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import compact from 'lodash/compact'

import { getMockQuestionnaire } from 'entities/application/DossierAreas/__tests__/mocks/clientDetailedDossier.mock'
import {
  ActionArea,
  DocumentsArea,
  DossierIdArea,
  EditRequisitesArea,
  InformationArea,
} from 'entities/application/DossierAreas/ui'
import { useGetFullApplicationQuery } from 'shared/api/requests/loanAppLifeCycleDc'
import { ApplicantDocsType, ApplicationFrontdc } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import { formatPassport } from 'shared/lib/utils'
import { getFullName } from 'shared/utils/clientNameTransform'

import { useStyles } from './ClientDetailedDossier.styles'

type Props = {
  applicationId: string
  onBackButton: () => void
}

export function ClientDetailedDossier({ applicationId, onBackButton }: Props) {
  const classes = useStyles()
  const { data: fullApplicationData } = useGetFullApplicationQuery(
    { applicationId: '111111' },
    { enabled: !!applicationId },
  )
  const [application, setApplication] = useState<ApplicationFrontdc | null>(null)

  const [fileQuestionnaire, setFileQuestionnaire] = useState<File>()
  const [agreementDocs, setAgreementDocs] = useState<(File | undefined)[]>([])
  const [isEditRequisitesMode, setIsEditRequisitesMode] = useState(false)

  useEffect(() => {
    if (!application && !!fullApplicationData?.application) {
      setApplication(fullApplicationData.application as ApplicationFrontdc)
    }
  }, [application, fullApplicationData])

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
    setApplication(prev => ({ ...prev, status: statusCode }))
  }

  const clientName = getFullName(
    application?.applicant?.lastName,
    application?.applicant?.firstName,
    application?.applicant?.middleName,
  )

  const passport = useMemo(() => {
    const { series, number } =
      application?.applicant?.documents?.find(d => d.type === ApplicantDocsType.Passport) || {}

    return formatPassport(series, number)
  }, [application?.applicant?.documents])

  const appInfo = useMemo(
    () => ({
      statusCode: application?.status || StatusCode.ERROR,
      vendorCode: application?.vendor?.vendorCode,
      vendorInfo: compact([application?.vendor?.vendorName, application?.vendor?.address]).join(', '),
      carBrand: application?.loanCar?.brand || '',
      carModel: application?.loanCar?.model || '',
      creditAmount: application?.loanData?.creditAmount,
      monthlyPayment: application?.loanData?.monthlyPayment,
      downPayment: application?.loanData?.downPayment,
      rate: application?.loanData?.productRates?.baseRate,
      productName: application?.loanData?.productName || '',
      term: application?.loanData?.term,
      additionalOptions: application?.loanData?.additionalOptions || [],
    }),
    [
      application?.status,
      application?.vendor?.vendorCode,
      application?.vendor?.vendorName,
      application?.vendor?.address,
      application?.loanCar?.brand,
      application?.loanCar?.model,
      application?.loanData?.creditAmount,
      application?.loanData?.monthlyPayment,
      application?.loanData?.downPayment,
      application?.loanData?.productRates?.baseRate,
      application?.loanData?.productName,
      application?.loanData?.term,
      application?.loanData?.additionalOptions,
    ],
  )

  return (
    <Box className={classes.container}>
      {!application ? (
        <CircularProgress className={classes.circular} />
      ) : isEditRequisitesMode ? (
        <EditRequisitesArea applicationId={applicationId} changeRequisites={setIsEditRequisitesMode} />
      ) : (
        <Box className={classes.container}>
          <DossierIdArea
            dcAppId={application.dcAppId || ''}
            clientName={clientName}
            passport={passport}
            onBackButton={onBackButton}
            status={application.status}
          />
          <Box className={classes.dossierContainer}>
            <InformationArea {...appInfo} />
            <DocumentsArea
              fileQuestionnaire={fileQuestionnaire}
              setQuestionnaire={setFileQuestionnaire}
              agreementDocs={agreementDocs}
              setAgreementDocs={setAgreementDocs}
              status={application?.status}
            />
            <ActionArea
              application={application}
              status={application.status}
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
