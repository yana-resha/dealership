import { useCallback, useMemo, useState } from 'react'

import { Box, Button } from '@mui/material'
import {
  ApplicationFrontdc,
  IsClientRequest,
  SendApplicationToScoringRequest,
  StatusCode,
} from '@sberauto/loanapplifecycledc-proto/public'
import { ApplicantDocsType, PhoneType } from '@sberauto/loanapplifecycledc-proto/public'
import { useNavigate } from 'react-router-dom'

import { updateOrder } from 'pages/CreateOrderPage/model/orderSlice'
import { NoMatchesModal } from 'pages/CreateOrderPage/OrderSearching/components/NoMatchesModal/NoMatchesModal'
import { checkIfSberClient } from 'shared/api/requests/loanAppLifeCycleDc'
import { useSendApplicationToScore } from 'shared/api/requests/loanAppLifeCycleDc'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { appRoutePaths } from 'shared/navigation/routerPath'
import SberTypography from 'shared/ui/SberTypography'

import { AgreementArea } from '../'
import { getPointOfSaleFromCookies } from '../../../../pointOfSale'
import { ApplicationTypes, getStatus, PreparedStatus } from '../../../application.utils'
import { useStyles } from './ActionArea.styles'

type Props = {
  status: StatusCode
  application: ApplicationFrontdc
  moratoryEndDate?: string
  targetDcAppId?: string
  applicationForScore: SendApplicationToScoringRequest
  returnToList: () => void
  goToTargetApplication: (targetAppId: string) => void
  updateStatus: (statusCode: StatusCode) => void
  fileQuestionnaire: File | undefined
  agreementDocs: (File | undefined)[]
  setAgreementDocs: (files: (File | undefined)[]) => void
  setIsEditRequisitesMode: (value: boolean) => void
}

export function ActionArea(props: Props) {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const {
    status,
    application,
    moratoryEndDate,
    targetDcAppId,
    applicationForScore,
    returnToList,
    goToTargetApplication,
    updateStatus,
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
    PreparedStatus.financed,
  ]
  const [isVisibleModal, setVisibleModal] = useState(false)
  const navigate = useNavigate()
  const { applicant } = application
  const { vendorCode } = getPointOfSaleFromCookies()
  const { mutateAsync: sendToScore } = useSendApplicationToScore({ onSuccess: returnToList })
  const passport = applicant?.documents?.find(document => document.type === ApplicantDocsType.PASSPORT)
  const phoneNumber = applicant?.phones?.find(document => document.type === PhoneType.MOBILE)

  const deleteLoanDataFromApplication = useCallback(() => {
    dispatch(
      updateOrder({
        orderData: {
          application: { ...application, loanData: undefined, loanCar: undefined, specialMark: undefined },
        },
      }),
    )
  }, [application, dispatch])

  const openModal = useCallback(() => {
    setVisibleModal(true)
  }, [])

  const closeModal = useCallback(() => setVisibleModal(false), [])

  const getToNewApplication = useCallback(() => {
    if (targetDcAppId) {
      goToTargetApplication(targetDcAppId)
    }
  }, [targetDcAppId, goToTargetApplication])

  const editApplicationWithInitialStatus = useCallback(() => {
    navigate(appRoutePaths.createOrder, {
      state: { isFullCalculator: false },
    })
  }, [navigate])

  const editApplicationWithErrorStatus = useCallback(() => {
    const isFullCalculator =
      application.vendor?.vendorCode === vendorCode && application.anketaType === 2 ? true : false
    navigate(appRoutePaths.createOrder, {
      state: { isFullCalculator, saveDraftDisabled: true },
    })
  }, [application.vendor?.vendorCode, vendorCode, application.anketaType, navigate])

  const editApplicationWithApprovedStatus = useCallback(() => {
    navigate(appRoutePaths.createOrder, {
      state: { isFullCalculator: false, saveDraftDisabled: true },
    })
  }, [navigate])

  const extendApplicationWithApprovedStatus = useCallback(() => {
    navigate(appRoutePaths.createOrder, {
      state: { isFullCalculator: true, saveDraftDisabled: true },
    })
  }, [navigate])

  const clientData = useMemo(
    (): IsClientRequest => ({
      lastName: applicant?.lastName,
      firstName: applicant?.firstName,
      middleName: applicant?.middleName,
      phoneNumber: phoneNumber
        ? '' + phoneNumber.countryPrefix + phoneNumber.prefix + phoneNumber.number
        : undefined,
      birthDate: applicant?.birthDate,
      passportSeries: passport?.series,
      passportNumber: passport?.number,
    }),
    [applicant, passport, phoneNumber],
  )

  const recreateApplication = useCallback(async () => {
    const response = await checkIfSberClient(clientData)
    if (response.isClient) {
      deleteLoanDataFromApplication()
      navigate(appRoutePaths.createOrder, {
        state: { isFullCalculator: false },
      })
    } else {
      openModal()
    }
  }, [clientData, deleteLoanDataFromApplication, navigate, openModal])

  const sendApplicationToScore = useCallback(() => {
    sendToScore(applicationForScore)
  }, [applicationForScore, sendToScore])

  const shownBlock = useMemo(() => {
    if (preparedStatus == PreparedStatus.initial) {
      return (
        <Box className={classes.actionButtons}>
          <Button variant="contained" onClick={editApplicationWithInitialStatus}>
            Редактировать
          </Button>
          {application.anketaType == ApplicationTypes.initial && (
            <Button variant="contained" onClick={sendApplicationToScore}>
              Отправить на решение
            </Button>
          )}
        </Box>
      )
    }
    if (preparedStatus == PreparedStatus.approved) {
      return (
        <Box className={classes.actionButtons}>
          <Button variant="contained" onClick={editApplicationWithApprovedStatus}>
            Редактировать
          </Button>
          {application.vendor?.vendorCode === vendorCode && (
            <Button variant="contained" onClick={extendApplicationWithApprovedStatus}>
              Дозаполнить анкету
            </Button>
          )}
        </Box>
      )
    }
    if (
      preparedStatus == PreparedStatus.canceled ||
      preparedStatus == PreparedStatus.canceledDeal ||
      preparedStatus == PreparedStatus.rejected
    ) {
      return (
        <Box className={classes.actionButtons}>
          {((preparedStatus == PreparedStatus.rejected &&
            ((moratoryEndDate && new Date() > new Date(moratoryEndDate)) || targetDcAppId)) ||
            preparedStatus != PreparedStatus.rejected) && (
            <>
              {targetDcAppId ? (
                <Button variant="contained" onClick={getToNewApplication}>
                  Перейти на новую заявку
                </Button>
              ) : (
                <Button variant="contained" onClick={recreateApplication}>
                  Пересоздать заявку
                </Button>
              )}
            </>
          )}
        </Box>
      )
    }
    if (preparedStatus == PreparedStatus.financed) {
      return (
        <Box className={classes.actionButtons}>
          {targetDcAppId ? (
            <Button variant="contained" onClick={getToNewApplication}>
              Перейти на новую заявку
            </Button>
          ) : (
            <Button variant="contained" onClick={recreateApplication}>
              Создать новую заявку
            </Button>
          )}
        </Box>
      )
    }
    if (preparedStatus == PreparedStatus.error) {
      return (
        <Box className={classes.actionButtons}>
          <Button variant="contained" onClick={editApplicationWithErrorStatus}>
            Редактировать
          </Button>
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
    agreementDocs,
    application,
    classes.actionButtons,
    editApplicationWithApprovedStatus,
    editApplicationWithErrorStatus,
    editApplicationWithInitialStatus,
    extendApplicationWithApprovedStatus,
    getToNewApplication,
    moratoryEndDate,
    preparedStatus,
    recreateApplication,
    sendApplicationToScore,
    setAgreementDocs,
    setIsEditRequisitesMode,
    status,
    targetDcAppId,
    updateStatus,
    vendorCode,
  ])

  return (
    <Box className={classes.blockContainer}>
      {showActionsStatuses.includes(preparedStatus) && (
        <SberTypography gridColumn="span 6" sberautoVariant="h5" component="p">
          Действие
        </SberTypography>
      )}
      {shownBlock}
      <NoMatchesModal isVisible={isVisibleModal} onClose={closeModal} />
    </Box>
  )
}
