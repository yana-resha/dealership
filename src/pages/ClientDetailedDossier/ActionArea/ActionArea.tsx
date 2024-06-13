import { useCallback, useMemo, useRef, useState } from 'react'

import { Box, Button } from '@mui/material'
import {
  ApplicationFrontdc,
  IsClientRequest,
  SendApplicationToScoringRequest,
  StatusCode,
} from '@sberauto/loanapplifecycledc-proto/public'
import { ApplicantDocsType, PhoneType } from '@sberauto/loanapplifecycledc-proto/public'
import { useNavigate } from 'react-router-dom'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { updateOrder } from 'entities/reduxStore/orderSlice'
import { NoMatchesModal } from 'pages/CreateOrder/OrderSearching/components/NoMatchesModal/NoMatchesModal'
import { useCheckIfSberClient } from 'shared/api/requests/loanAppLifeCycleDc'
import { useSendApplicationToScore } from 'shared/api/requests/loanAppLifeCycleDc'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { appRoutePaths } from 'shared/navigation/routerPath'
import SberTypography from 'shared/ui/SberTypography'

import { AnketaType, getStatus, PreparedStatus } from '../../../entities/application/application.utils'
import { DossierAreaContainer } from '../DossierAreaContainer/DossierAreaContainer'
import { DcConfirmationModal } from '../EditConfirmationModal/DcConfirmationModal'
import { useStyles } from './ActionArea.styles'
import { AgreementArea } from './AgreementArea/AgreementArea'

enum Source {
  DC = 'DC',
}

type Props = {
  status: StatusCode
  application: ApplicationFrontdc
  moratoryEndDate?: string
  source?: string
  targetDcAppId?: string
  applicationForScore: SendApplicationToScoringRequest
  returnToList: () => void
  goToTargetApplication: (targetAppId: string) => void
  updateApplicationStatusLocally: (statusCode: StatusCode) => void
  setIsEditRequisitesMode: (value: boolean) => void
}

export function ActionArea({
  status,
  application,
  moratoryEndDate,
  source,
  targetDcAppId,
  applicationForScore,
  returnToList,
  goToTargetApplication,
  updateApplicationStatusLocally,
  setIsEditRequisitesMode,
}: Props) {
  const classes = useStyles()
  const dispatch = useAppDispatch()

  const preparedStatus = getStatus(status)

  const [isVisibleModal, setVisibleModal] = useState(false)
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false)
  const confirmedAction = useRef<() => void>()
  const navigate = useNavigate()
  const { applicant } = application
  const { vendorCode } = getPointOfSaleFromCookies()
  const { mutateAsync: sendToScoreMutate, isLoading: isSendToScoreLoading } = useSendApplicationToScore({
    onSuccess: returnToList,
  })
  const { mutateAsync: checkIfSberClientMutate, isLoading: isCheckIfSberClientLoading } =
    useCheckIfSberClient()

  const passport = applicant?.documents?.find(document => document.type === ApplicantDocsType.PASSPORT)
  const phoneNumber = applicant?.phones?.find(document => document.type === PhoneType.MOBILE)

  const deleteLoanDataFromApplication = useCallback(() => {
    dispatch(
      updateOrder({
        orderData: {
          application: { applicant: application.applicant },
        },
      }),
    )
  }, [application, dispatch])

  const openModal = useCallback(() => {
    setVisibleModal(true)
  }, [])

  const closeModal = useCallback(() => setVisibleModal(false), [])

  const editApplication = useCallback(
    (editFunction: () => void) => {
      if (application.vendor?.vendorCode !== vendorCode) {
        setConfirmationModalVisible(true)
        confirmedAction.current = editFunction
      } else {
        editFunction()
      }
    },
    [application.vendor?.vendorCode, vendorCode],
  )

  const closeConfirmationModal = useCallback(() => {
    setConfirmationModalVisible(false)
  }, [])

  const getToNewApplication = useCallback(() => {
    if (targetDcAppId) {
      goToTargetApplication(targetDcAppId)
    }
  }, [targetDcAppId, goToTargetApplication])

  const editApplicationWithInitialStatus = useCallback(() => {
    navigate(appRoutePaths.createOrder, {
      state: { isExistingApplication: true, isFullCalculator: false },
    })
  }, [navigate])

  const extendApplicationWithApprovedStatus = useCallback(() => {
    navigate(appRoutePaths.createOrder, {
      state: { isExistingApplication: true, isFullCalculator: true, saveDraftDisabled: true },
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
    const response = await checkIfSberClientMutate(clientData)
    if (response.isClient) {
      deleteLoanDataFromApplication()
      navigate(appRoutePaths.createOrder, {
        state: { isExistingApplication: true, isFullCalculator: false },
      })
    } else {
      openModal()
    }
  }, [checkIfSberClientMutate, clientData, deleteLoanDataFromApplication, navigate, openModal])

  const sendApplicationToScore = useCallback(() => {
    sendToScoreMutate(applicationForScore)
  }, [applicationForScore, sendToScoreMutate])

  const isShouldShowRecreateButton =
    preparedStatus === PreparedStatus.canceled ||
    preparedStatus === PreparedStatus.canceledDeal ||
    ((preparedStatus === PreparedStatus.rejected || preparedStatus === PreparedStatus.clientRejected) &&
      ((moratoryEndDate && new Date() > new Date(moratoryEndDate)) ||
        source !== Source.DC ||
        !!targetDcAppId))

  const editingBtn = useMemo(
    () => (
      <Button variant="contained" onClick={() => editApplication(editApplicationWithInitialStatus)}>
        Редактировать
      </Button>
    ),
    [editApplication, editApplicationWithInitialStatus],
  )

  const goingToNewApplicationBtn = useMemo(
    () => (
      <Button variant="contained" onClick={getToNewApplication}>
        Перейти на новую заявку
      </Button>
    ),
    [getToNewApplication],
  )

  const creationApplicationBtn = useMemo(
    () => (
      <Button variant="contained" onClick={recreateApplication} disabled={isCheckIfSberClientLoading}>
        {isShouldShowRecreateButton ? 'Пересоздать новую заявку' : 'Создать новую заявку'}
      </Button>
    ),
    [isCheckIfSberClientLoading, isShouldShowRecreateButton, recreateApplication],
  )

  const shownBlock = useMemo(() => {
    if (preparedStatus == PreparedStatus.initial) {
      return (
        <Box className={classes.actionButtons}>
          {editingBtn}
          {application.anketaType == AnketaType.Complete && (
            <Button variant="contained" onClick={sendApplicationToScore} disabled={isSendToScoreLoading}>
              Отправить на решение
            </Button>
          )}
        </Box>
      )
    }
    if (preparedStatus == PreparedStatus.approved) {
      return (
        <Box className={classes.actionButtons}>
          {editingBtn}
          {application.vendor?.vendorCode === vendorCode && (
            <Button
              variant="contained"
              onClick={extendApplicationWithApprovedStatus}
              disabled={isSendToScoreLoading}
            >
              Дозаполнить анкету
            </Button>
          )}
        </Box>
      )
    }
    if (isShouldShowRecreateButton || preparedStatus == PreparedStatus.financed) {
      return (
        <Box className={classes.actionButtons}>
          {targetDcAppId ? goingToNewApplicationBtn : creationApplicationBtn}
        </Box>
      )
    }
    if (preparedStatus == PreparedStatus.error) {
      return <Box className={classes.actionButtons}>{editingBtn}</Box>
    }
    if (
      [PreparedStatus.finallyApproved, PreparedStatus.formation, PreparedStatus.signed].includes(
        preparedStatus,
      )
    ) {
      return (
        <AgreementArea
          status={status}
          updateApplicationStatusLocally={updateApplicationStatusLocally}
          setIsEditRequisitesMode={setIsEditRequisitesMode}
          isConfirmationModalVisible={isConfirmationModalVisible}
          closeConfirmationModal={closeConfirmationModal}
          confirmedAction={confirmedAction.current}
          editApplication={editApplication}
        />
      )
    }
  }, [
    application.anketaType,
    application.vendor?.vendorCode,
    classes.actionButtons,
    closeConfirmationModal,
    creationApplicationBtn,
    editApplication,
    editingBtn,
    extendApplicationWithApprovedStatus,
    goingToNewApplicationBtn,
    isConfirmationModalVisible,
    isSendToScoreLoading,
    isShouldShowRecreateButton,
    preparedStatus,
    sendApplicationToScore,
    setIsEditRequisitesMode,
    status,
    targetDcAppId,
    updateApplicationStatusLocally,
    vendorCode,
  ])

  return (
    <>
      {!!shownBlock && (
        <DossierAreaContainer>
          <Box className={classes.blockContainer}>
            <SberTypography gridColumn="span 6" sberautoVariant="h5" component="p">
              Действие
            </SberTypography>
            {shownBlock}
          </Box>
        </DossierAreaContainer>
      )}

      <DcConfirmationModal
        actionText="Заявка будет заведена под:"
        isVisible={isConfirmationModalVisible}
        onClose={closeConfirmationModal}
        confirmedAction={confirmedAction.current}
      />
      <NoMatchesModal isVisible={isVisibleModal} onClose={closeModal} />
    </>
  )
}
