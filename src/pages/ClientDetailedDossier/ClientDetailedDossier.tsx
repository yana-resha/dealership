import { useCallback, useMemo, useState } from 'react'

import { Box, Button } from '@mui/material'
import {
  ApplicantDocsType,
  SendApplicationToScoringRequest,
  StatusCode,
} from '@sberauto/loanapplifecycledc-proto/public'
import compact from 'lodash/compact'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { ApplicationProvider } from 'entities/application/ApplicationProvider'
import {
  ActionArea,
  DocumentsArea,
  DossierIdArea,
  EditRequisitesArea,
  InformationArea,
} from 'entities/application/DossierAreas/ui'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { setOrder, updateOrder } from 'entities/reduxStore/orderSlice'
import { useGetFullApplicationQuery } from 'shared/api/requests/loanAppLifeCycleDc'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { formatPassport } from 'shared/lib/utils'
import { appRoutes } from 'shared/navigation/routerPath'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel/CircularProgressWheel'
import SberTypography from 'shared/ui/SberTypography/SberTypography'
import { getFullName } from 'shared/utils/clientNameTransform'

import { useStyles } from './ClientDetailedDossier.styles'

export function ClientDetailedDossier() {
  const classes = useStyles()

  const navigate = useNavigate()
  const { applicationId = '' } = useParams()
  const { isLoading, isError } = useGetFullApplicationQuery(
    { applicationId },
    {
      onSuccess: response => {
        dispatch(setOrder({ orderData: response }))
      },
    },
  )

  const dispatch = useDispatch()
  const fullApplicationData = useAppSelector(state => state.order.order)?.orderData
  const application = fullApplicationData?.application
  const { unit } = getPointOfSaleFromCookies()
  const [agreementDocs, setAgreementDocs] = useState<(File | undefined)[]>([])
  const [isEditRequisitesMode, setIsEditRequisitesMode] = useState(false)

  const clientName = getFullName(
    application?.applicant?.lastName,
    application?.applicant?.firstName,
    application?.applicant?.middleName,
  )

  const prepareApplicationForScore = useCallback(() => {
    const request: SendApplicationToScoringRequest = {
      application: application ? { ...application, unit: unit } : null,
    }

    return request
  }, [application, unit])

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
      downPayment: application?.loanData?.downpayment,
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
      application?.loanData?.downpayment,
      application?.loanData?.productRates?.baseRate,
      application?.loanData?.productName,
      application?.loanData?.term,
      application?.loanData?.additionalOptions,
    ],
  )

  const goToTargetApplication = useCallback(
    (targetAppId: string) => {
      if (applicationId !== targetAppId) {
        navigate(appRoutes.order(targetAppId))
      }
    },
    [applicationId, navigate],
  )

  const onGetOrderId = useCallback(async () => applicationId, [applicationId])

  const onBackButton = useCallback(() => navigate(-1), [navigate])

  const updateApplicationStatusLocally = useCallback(
    (statusCode: StatusCode) => {
      if (application) {
        dispatch(
          updateOrder({
            orderData: {
              ...fullApplicationData,
              application: { ...application, status: statusCode },
            },
          }),
        )
      }
    },
    [application, dispatch, fullApplicationData],
  )

  return (
    <div className={classes.page} data-testid="clientDetailedDossier">
      <ApplicationProvider onGetOrderId={onGetOrderId}>
        <Box className={classes.container}>
          {isLoading && (
            <Box className={classes.circular}>
              <CircularProgressWheel size="large" />
            </Box>
          )}
          {isError && (
            <>
              <SberTypography sberautoVariant="body3" component="p">
                Ошибка. Не удалось получить данные о заявке
              </SberTypography>
              <Button variant="text" onClick={onBackButton}>
                Вернутся назад
              </Button>
            </>
          )}
          {!isLoading && !isError && application && (
            <>
              {isEditRequisitesMode ? (
                <EditRequisitesArea
                  applicationId={applicationId}
                  changeRequisites={setIsEditRequisitesMode}
                />
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
                      goToTargetApplication={goToTargetApplication}
                      status={
                        application.status || application.status === StatusCode.INITIAL
                          ? application.status
                          : StatusCode.ERROR
                      }
                      agreementDocs={agreementDocs}
                      setAgreementDocs={setAgreementDocs}
                      setIsEditRequisitesMode={setIsEditRequisitesMode}
                      updateApplicationStatusLocally={updateApplicationStatusLocally}
                    />
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </ApplicationProvider>
    </div>
  )
}
