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
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { updateOrder } from 'entities/reduxStore/orderSlice'
import { useGetFullApplicationQuery } from 'pages/ClientDetailedDossier/hooks/useGetFullApplicationQuery'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { formatPassport } from 'shared/lib/utils'
import { appRoutePaths, appRoutes } from 'shared/navigation/routerPath'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel/CircularProgressWheel'
import SberTypography from 'shared/ui/SberTypography/SberTypography'
import { getFullName } from 'shared/utils/clientNameTransform'

import { ActionArea } from './ActionArea/ActionArea'
import { useStyles } from './ClientDetailedDossier.styles'
import { DocumentsArea } from './DocumentsArea/DocumentsArea'
import { DossierIdArea } from './DossierIdArea/DossierIdArea'
import { EditRequisitesArea } from './EditRequisitesArea/EditRequisitesArea'
import { InformationArea } from './InformationArea/InformationArea'

export function ClientDetailedDossier() {
  const classes = useStyles()

  const navigate = useNavigate()
  const { applicationId = '' } = useParams()
  const { isLoading, isError } = useGetFullApplicationQuery({ applicationId })

  const dispatch = useDispatch()
  const fullApplicationData = useAppSelector(state => state.order.order)?.orderData
  const application = fullApplicationData?.application
  const { unit } = getPointOfSaleFromCookies()
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
      statusCode: application?.status ?? StatusCode.ERROR,
      errorDescription: fullApplicationData?.errorDescription,
      vendorCode: application?.vendor?.vendorCode,
      vendorInfo: compact([application?.vendor?.vendorName, application?.vendor?.address]).join(', '),
      carBrand: application?.loanCar?.brand || '',
      carModel: application?.loanCar?.model || '',
      autoPrice: application?.loanCar?.autoPrice,
      creditAmount: application?.loanData?.amount,
      monthlyPayment: application?.loanData?.monthlyPayment,
      downPayment: application?.loanData?.downpayment,
      rate: application?.loanData?.productRates?.baseRate,
      productName: application?.loanData?.productName || '',
      term: application?.loanData?.term,
      additionalOptions: application?.loanData?.additionalOptions || [],
      overpayment: application?.loanData?.overpayment,
      incomeProduct: application?.loanData?.incomeProduct ?? false,
      scans: application?.scans || [],
    }),
    [
      application?.status,
      application?.vendor?.vendorCode,
      application?.vendor?.vendorName,
      application?.vendor?.address,
      application?.loanCar?.brand,
      application?.loanCar?.model,
      application?.loanCar?.autoPrice,
      application?.loanData?.amount,
      application?.loanData?.monthlyPayment,
      application?.loanData?.downpayment,
      application?.loanData?.productRates?.baseRate,
      application?.loanData?.productName,
      application?.loanData?.term,
      application?.loanData?.additionalOptions,
      application?.loanData?.overpayment,
      application?.loanData?.incomeProduct,
      application?.scans,
      fullApplicationData?.errorDescription,
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

  const onBackButton = useCallback(() => navigate(appRoutePaths.orderList), [navigate])

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
                    appId={fullApplicationData.appId}
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
                      status={
                        application.status || application.status === StatusCode.INITIAL
                          ? application.status
                          : StatusCode.ERROR
                      }
                    />

                    <ActionArea
                      application={application}
                      moratoryEndDate={fullApplicationData?.moratoryEndDate}
                      source={fullApplicationData?.source}
                      targetDcAppId={fullApplicationData?.targetDcAppId}
                      applicationForScore={prepareApplicationForScore()}
                      returnToList={onBackButton}
                      goToTargetApplication={goToTargetApplication}
                      status={
                        application.status || application.status === StatusCode.INITIAL
                          ? application.status
                          : StatusCode.ERROR
                      }
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
