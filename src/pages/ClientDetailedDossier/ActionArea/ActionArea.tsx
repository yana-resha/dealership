import { useCallback, useMemo, useRef, useState } from 'react'

import { Box, Button } from '@mui/material'
import {
  DocumentType,
  IsClientRequest,
  Scan,
  SendApplicationToScoringRequest,
  StatusCode,
} from '@sberauto/loanapplifecycledc-proto/public'
import { ApplicantDocsType, PhoneType } from '@sberauto/loanapplifecycledc-proto/public'
import { useSnackbar } from 'notistack'
import { useNavigate, useParams } from 'react-router-dom'

import { theme } from 'app/theme'
import { updateOrder } from 'entities/order'
import { selectApplication } from 'entities/order/model/selectors'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { NoMatchesModal } from 'pages/CreateOrder/OrderSearching/components/NoMatchesModal/NoMatchesModal'
import {
  useCheckIfSberClient,
  useSendGovProgramDocumentsMutation,
  useSendToFinancingMutation,
} from 'shared/api/requests/loanAppLifeCycleDc'
import { useSendApplicationToScore } from 'shared/api/requests/loanAppLifeCycleDc'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { appRoutePaths } from 'shared/navigation/routerPath'
import { AreaContainer } from 'shared/ui/AreaContainer'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import SberTypography from 'shared/ui/SberTypography'

import { AnketaType, getStatus, PreparedStatus } from '../../../entities/applications/application.utils'
import { DcConfirmationModal } from '../EditConfirmationModal/DcConfirmationModal'
import { useGetFullApplicationQuery } from '../hooks/useGetFullApplicationQuery'
import { useStyles } from './ActionArea.styles'
import { AgreementArea } from './AgreementArea/AgreementArea'

enum Source {
  DC = 'DC',
}

type Props = {
  status: StatusCode
  moratoryEndDate?: string
  source?: string
  targetDcAppId?: string
  applicationForScore: SendApplicationToScoringRequest
  returnToList: () => void
  goToTargetApplication: (targetAppId: string) => void
  updateApplicationStatusLocally: (statusCode: StatusCode) => void
  setIsEditRequisitesMode: (value: boolean) => void
  isGovProgramDocumentsSendingBlocked: boolean
  isGovProgramDocumentsPending: boolean
  isGovProgramDocumentsSuccess: boolean
  currentGovProgramScans: (Scan | undefined)[]
}

export function ActionArea({
  status,
  moratoryEndDate,
  source,
  targetDcAppId,
  applicationForScore,
  returnToList,
  goToTargetApplication,
  updateApplicationStatusLocally,
  setIsEditRequisitesMode,
  isGovProgramDocumentsSendingBlocked,
  isGovProgramDocumentsPending,
  isGovProgramDocumentsSuccess,
  currentGovProgramScans,
}: Props) {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const application = useAppSelector(selectApplication)
  const { applicant, dcAppId } = application
  const isHasGovProgram = !!application.loanData?.govprogramCode

  const preparedStatus = getStatus(status)

  const [isVisibleModal, setVisibleModal] = useState(false)
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false)
  const confirmedAction = useRef<() => void>()
  const { vendorCode } = getPointOfSaleFromCookies()
  const { isLoading: isGetFullApplicationQueryLoading, refetch: refetchGetFullApplicationQuery } =
    useGetFullApplicationQuery({ applicationId: dcAppId }, { enabled: false })
  const { mutateAsync: sendToScoreMutate, isLoading: isSendToScoreLoading } = useSendApplicationToScore({
    onSuccess: returnToList,
  })
  const { mutateAsync: checkIfSberClientMutate, isLoading: isCheckIfSberClientLoading } =
    useCheckIfSberClient()
  const { mutate: sendGovProgramDocumentsMutate, isLoading: isSendGovProgramDocumentsLoading } =
    useSendGovProgramDocumentsMutation()
  const { mutateAsync: sendToFinancing, isLoading: isSendLoading } = useSendToFinancingMutation()
  const { applicationId = '' } = useParams()
  const { refetch: refetchFullApplication, isFetching: isRefetchFullApplicationLoading } =
    useGetFullApplicationQuery({ applicationId }, { enabled: false })

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

  const editApplicationWithErrorStatus = useCallback(() => {
    const isFullCalculator =
      application.vendor?.vendorCode === vendorCode && application.anketaType === 2 ? true : false
    navigate(appRoutePaths.createOrder, {
      state: { isExistingApplication: true, isFullCalculator, saveDraftDisabled: true },
    })
  }, [application.vendor?.vendorCode, vendorCode, application.anketaType, navigate])

  const editApplicationWithApprovedStatus = useCallback(() => {
    navigate(appRoutePaths.createOrder, {
      state: { isExistingApplication: true, isFullCalculator: false, saveDraftDisabled: true },
    })
  }, [navigate])

  const editFullApplication = useCallback(() => {
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

  const handleSendToFinancingBtnClick = useCallback(() => {
    sendToFinancing({
      dcAppId: application.dcAppId,
    })
      .then(() => refetchFullApplication())
      .catch(() =>
        enqueueSnackbar('Не удалось отправить на финансирование. Попробуйте еще раз', { variant: 'error' }),
      )
  }, [sendToFinancing, application.dcAppId, refetchFullApplication, enqueueSnackbar])

  const filteredGovProgramScans = useMemo(
    () => currentGovProgramScans.filter((scan): scan is Scan => !!scan),
    [currentGovProgramScans],
  )

  // Проверяем, что все сканы загружены и не на проверке
  const isSendGovProgramDocumentsDisabled =
    isGovProgramDocumentsSendingBlocked ||
    isSendGovProgramDocumentsLoading ||
    isGetFullApplicationQueryLoading

  const currentGovProgramDocumentTypes = useMemo(
    () =>
      filteredGovProgramScans
        .filter((scan): scan is Scan & { type: DocumentType } => !!scan.type)
        .map(scan => scan.type),
    [filteredGovProgramScans],
  )

  const sendGovProgramDocuments = useCallback(
    () =>
      sendGovProgramDocumentsMutate(
        {
          dcAppId: application.dcAppId,
          documentTypes: currentGovProgramDocumentTypes,
        },
        {
          onSuccess: () => refetchGetFullApplicationQuery(),
        },
      ),
    [
      application.dcAppId,
      currentGovProgramDocumentTypes,
      refetchGetFullApplicationQuery,
      sendGovProgramDocumentsMutate,
    ],
  )

  const isShouldShowRecreateButton =
    preparedStatus === PreparedStatus.canceled ||
    preparedStatus === PreparedStatus.canceledDeal ||
    ((preparedStatus === PreparedStatus.rejected || preparedStatus === PreparedStatus.clientRejected) &&
      ((moratoryEndDate && new Date() > new Date(moratoryEndDate)) ||
        source !== Source.DC ||
        !!targetDcAppId)) ||
    (preparedStatus === PreparedStatus.lackConfirmation &&
      moratoryEndDate &&
      new Date() > new Date(moratoryEndDate))

  const shownBlock = useMemo(() => {
    if (preparedStatus == PreparedStatus.initial) {
      return (
        <Box className={classes.actionButtons}>
          <Button variant="contained" onClick={() => editApplication(editApplicationWithInitialStatus)}>
            Редактировать
          </Button>
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
          <Button
            variant="contained"
            onClick={() => editApplication(editApplicationWithApprovedStatus)}
            disabled={isHasGovProgram && isGovProgramDocumentsPending}
          >
            Редактировать
          </Button>

          {isHasGovProgram && !isGovProgramDocumentsSuccess && (
            <Button
              variant="contained"
              onClick={sendGovProgramDocuments}
              disabled={isSendGovProgramDocumentsDisabled}
            >
              {isSendGovProgramDocumentsLoading ? (
                <CircularProgressWheel size="small" color={theme.palette.background.default} />
              ) : (
                'Отправить документы'
              )}
            </Button>
          )}

          {application.vendor?.vendorCode === vendorCode &&
            (!isHasGovProgram || isGovProgramDocumentsSuccess) && (
              <Button variant="contained" onClick={editFullApplication} disabled={isSendToScoreLoading}>
                Дозаполнить анкету
              </Button>
            )}
        </Box>
      )
    }
    if (
      preparedStatus == PreparedStatus.finallyApproved &&
      isHasGovProgram &&
      !isGovProgramDocumentsSuccess
    ) {
      return (
        <Box className={classes.actionButtons}>
          <Button
            variant="contained"
            onClick={() => editApplication(editFullApplication)}
            disabled={isHasGovProgram && isGovProgramDocumentsPending}
          >
            Редактировать
          </Button>

          {isHasGovProgram && !isGovProgramDocumentsSuccess && (
            <Button
              variant="contained"
              onClick={sendGovProgramDocuments}
              disabled={isSendGovProgramDocumentsDisabled}
            >
              {isSendGovProgramDocumentsLoading ? (
                <CircularProgressWheel size="small" color={theme.palette.background.default} />
              ) : (
                'Отправить документы'
              )}
            </Button>
          )}
        </Box>
      )
    }
    if (
      isShouldShowRecreateButton ||
      preparedStatus == PreparedStatus.financed ||
      preparedStatus === PreparedStatus.dcFinanced
    ) {
      return (
        <Box className={classes.actionButtons}>
          {targetDcAppId ? (
            <Button variant="contained" onClick={getToNewApplication}>
              Перейти на новую заявку
            </Button>
          ) : (
            <Button variant="contained" onClick={recreateApplication} disabled={isCheckIfSberClientLoading}>
              {isShouldShowRecreateButton ? 'Пересоздать новую заявку' : 'Создать новую заявку'}
            </Button>
          )}
        </Box>
      )
    }
    if (preparedStatus == PreparedStatus.error) {
      return (
        <Box className={classes.actionButtons}>
          <Button variant="contained" onClick={() => editApplication(editApplicationWithErrorStatus)}>
            Редактировать
          </Button>
        </Box>
      )
    }
    if (
      [PreparedStatus.issueError, PreparedStatus.signing, PreparedStatus.smsFailed].includes(preparedStatus)
    ) {
      return (
        <Box className={classes.actionButtons}>
          <Button
            variant="contained"
            className={classes.financingButton}
            onClick={handleSendToFinancingBtnClick}
            disabled={isSendLoading || isRefetchFullApplicationLoading}
          >
            {isSendLoading || isRefetchFullApplicationLoading ? (
              <CircularProgressWheel size="small" />
            ) : (
              <>Отправить на финансирование</>
            )}
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
          updateApplicationStatusLocally={updateApplicationStatusLocally}
          setIsEditRequisitesMode={setIsEditRequisitesMode}
          isConfirmationModalVisible={isConfirmationModalVisible}
          closeConfirmationModal={closeConfirmationModal}
          confirmedAction={confirmedAction.current}
          editApplication={editApplication}
          onSendToFinancing={handleSendToFinancingBtnClick}
          isSendLoading={isSendLoading}
        />
      )
    }
  }, [
    application.anketaType,
    application.vendor?.vendorCode,
    classes.actionButtons,
    classes.financingButton,
    closeConfirmationModal,
    editApplication,
    editApplicationWithApprovedStatus,
    editApplicationWithErrorStatus,
    editApplicationWithInitialStatus,
    editFullApplication,
    getToNewApplication,
    handleSendToFinancingBtnClick,
    isCheckIfSberClientLoading,
    isConfirmationModalVisible,
    isGovProgramDocumentsPending,
    isGovProgramDocumentsSuccess,
    isHasGovProgram,
    isSendGovProgramDocumentsDisabled,
    isSendGovProgramDocumentsLoading,
    isRefetchFullApplicationLoading,
    isSendLoading,
    isSendToScoreLoading,
    isShouldShowRecreateButton,
    preparedStatus,
    recreateApplication,
    sendApplicationToScore,
    sendGovProgramDocuments,
    setIsEditRequisitesMode,
    status,
    targetDcAppId,
    updateApplicationStatusLocally,
    vendorCode,
  ])

  return (
    <>
      {!!shownBlock && (
        <AreaContainer>
          <Box className={classes.blockContainer}>
            <SberTypography gridColumn="span 6" sberautoVariant="h5" component="p">
              Действие
            </SberTypography>
            {shownBlock}
          </Box>
        </AreaContainer>
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
