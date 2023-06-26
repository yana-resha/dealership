import { useCallback, useEffect, useMemo, useState } from 'react'

import { Box, CircularProgress } from '@mui/material'
import {
  ApplicantDocsType,
  ApplicationFrontdc,
  SendApplicationToScoringRequest,
  StatusCode,
} from '@sberauto/loanapplifecycledc-proto/public'
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
import { ApplicationFrontDc } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import { formatPassport } from 'shared/lib/utils'
import { getFullName } from 'shared/utils/clientNameTransform'

import { useStyles } from './ClientDetailedDossier.styles'

type Props = {
  applicationId: string
  onBackButton: () => void
}

export function ClientDetailedDossier({ applicationId, onBackButton }: Props) {
  const classes = useStyles()
  const [fullApplicationId, setFullApplicationId] = useState(applicationId)
  const { data: fullApplicationData, refetch } = useGetFullApplicationQuery(
    { applicationId: fullApplicationId },
    { enabled: !!applicationId },
  )
  const [application, setApplication] = useState<ApplicationFrontDc | null>(null)
  //TODO: Убрать мок после появления поля unit в Vendor
  const unit = 'currentUnit'
  const [fileQuestionnaire, setFileQuestionnaire] = useState<File>()
  const [agreementDocs, setAgreementDocs] = useState<(File | undefined)[]>([])
  const [isEditRequisitesMode, setIsEditRequisitesMode] = useState(false)

  useEffect(() => {
    refetch()
  }, [fullApplicationId, refetch])

  useEffect(() => {
    if (fullApplicationData?.application) {
      setApplication(fullApplicationData.application as ApplicationFrontDc)
    }
  }, [fullApplicationData])

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

  const prepareApplicationForScore = useCallback(() => {
    const request: SendApplicationToScoringRequest = {
      application: fullApplicationData
        ? ({
            ...fullApplicationData.application,
            unit: unit,
          } as ApplicationFrontdc)
        : null,
    }

    return request
  }, [fullApplicationData])

  const passport = useMemo(() => {
    const { series, number } =
      application?.applicant?.documents?.find(d => d.type === ApplicantDocsType.PASSPORT) || {}

    return formatPassport(series, number)
  }, [application?.applicant?.documents])

  const appInfo = useMemo(
    () => ({
      statusCode: application?.status || StatusCode.ERROR,
      vendorCode: application?.vendor?.vendorCode,
      vendorInfo: compact([application?.vendor?.vendorName, application?.vendor?.address]).join(', '),
      carBrand: application?.loanCar?.brand || '',
      carModel: application?.loanCar?.model || '',
      creditAmount: application?.loanData?.amount,
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
      application?.loanData?.amount,
      application?.loanData?.monthlyPayment,
      application?.loanData?.downPayment,
      application?.loanData?.productRates?.baseRate,
      application?.loanData?.productName,
      application?.loanData?.term,
      application?.loanData?.additionalOptions,
    ],
  )

  const goToNewApplication = useCallback((newApplicationId: string) => {
    setFullApplicationId(newApplicationId)
  }, [])

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
            status={
              application.status || application.status === StatusCode.INITIAL
                ? application.status
                : StatusCode.ERROR
            }
          />
          <Box className={classes.dossierContainer}>
            <InformationArea {...appInfo} />
            <DocumentsArea
              fileQuestionnaire={fileQuestionnaire}
              setQuestionnaire={setFileQuestionnaire}
              agreementDocs={agreementDocs}
              setAgreementDocs={setAgreementDocs}
              status={
                application.status || application.status === StatusCode.INITIAL
                  ? application.status
                  : StatusCode.ERROR
              }
            />
            <ActionArea
              application={application}
              moratoryEndDate={fullApplicationData?.moratoryEndDate}
              targetDcAppId={fullApplicationData?.targetDcAppId}
              applicationForScore={prepareApplicationForScore()}
              returnToList={onBackButton}
              goToNewApplication={goToNewApplication}
              status={
                application.status || application.status === StatusCode.INITIAL
                  ? application.status
                  : StatusCode.ERROR
              }
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
