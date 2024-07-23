import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Box, Button } from '@mui/material'
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { useSnackbar } from 'notistack'
import { useNavigate, useParams } from 'react-router-dom'

import { getStatus, PreparedStatus } from 'entities/applications/application.utils'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { useCheckDocumentsList } from 'features/ApplicationFileLoader/hooks/useCheckDocumentsList'
import { DcConfirmationModal } from 'pages/ClientDetailedDossier/EditConfirmationModal/DcConfirmationModal'
import { useAgreementDocs } from 'pages/ClientDetailedDossier/hooks/useAgreementDocs'
import {
  useFormContractMutation,
  useUpdateApplicationStatusMutation,
} from 'shared/api/requests/loanAppLifeCycleDc'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { appRoutePaths } from 'shared/navigation/routerPath'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel/CircularProgressWheel'
import { ProgressBar } from 'shared/ui/ProgressBar/ProgressBar'
import SberTypography from 'shared/ui/SberTypography'

import { AGREEMENT_DOC_TYPES, progressBarConfig } from '../../config'
import { useGetFullApplicationQuery } from '../../hooks/useGetFullApplicationQuery'
import { DocsStatus, ProgressBarSteps } from './AgreementArea.config'
import { useStyles } from './AgreementArea.styles'
import { AgreementDocument } from './AgreementDocument/AgreementDocument'
import { RequisitesArea } from './RequisitesArea/RequisitesArea'

type Props = {
  status: StatusCode
  updateApplicationStatusLocally: (statusCode: StatusCode) => void
  setIsEditRequisitesMode: (value: boolean) => void
  isConfirmationModalVisible: boolean
  closeConfirmationModal: () => void
  confirmedAction?: () => void
  editApplication: (editFunction: () => void) => void
  onSendToFinancing: () => void
  isSendLoading: boolean
}

export function AgreementArea({
  status,
  updateApplicationStatusLocally,
  setIsEditRequisitesMode,

  isConfirmationModalVisible,
  closeConfirmationModal,
  editApplication,
  confirmedAction,
  onSendToFinancing,
  isSendLoading,
}: Props) {
  const classes = useStyles()
  const preparedStatus = getStatus(status)
  const { applicationId = '' } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const application = useAppSelector(state => state.order.order?.orderData?.application || {})

  const navigate = useNavigate()
  const [isDocsLoading, setDocsLoading] = useState(false)
  const [isDocsFetched, setDocsFetched] = useState(false)
  const [docsStatus, setDocsStatus] = useState<string[]>([])
  const [isRightsAssigned, setRightsAssigned] = useState<boolean>()
  const [financingEnabled, setFinancingEnabled] = useState(true)
  const agreementAreaRef = useRef<HTMLDivElement | undefined>()

  const { vendorCode } = getPointOfSaleFromCookies()
  const { refetch: refetchGetFullApplication } = useGetFullApplicationQuery(
    { applicationId },
    { enabled: false },
  )
  const { mutate: updateApplicationStatusMutate, isLoading: isStatusLoading } =
    useUpdateApplicationStatusMutation(application?.dcAppId ?? '', (statusCode: StatusCode) => {
      updateApplicationStatusLocally(statusCode)
      // требуется обновлять заявку, т.к. меняется количество сканов в ней при шаге назад.
      if (statusCode === StatusCode.FINALLY_APPROVED) {
        refetchGetFullApplication()
      }
    })
  const { mutateAsync: formContractMutate } = useFormContractMutation({
    dcAppId: application?.dcAppId ?? '',
  })
  const { refetch: refetchFullApplication, isFetching: isRefetchFullApplicationLoading } =
    useGetFullApplicationQuery({ applicationId }, { enabled: false })
  const { checkApplicationDocumentsList } = useCheckDocumentsList()

  const { uploadedAgreementScans, uploadedAdditionalAgreementScans, agreementDocs } = useAgreementDocs(
    status !== StatusCode.FINALLY_APPROVED,
  )

  const currentStep = useMemo(() => {
    switch (status) {
      case StatusCode.FINALLY_APPROVED: {
        return ProgressBarSteps.CreateAgreementStep
      }
      case StatusCode.FORMATION: {
        return [DocsStatus.Downloaded, DocsStatus.Signed].some(value => docsStatus.includes(value))
          ? ProgressBarSteps.SignAgreementStep
          : ProgressBarSteps.DownloadAgreementStep
      }
      case StatusCode.SIGNED: {
        return ProgressBarSteps.CheckRequisites
      }
      default: {
        return ProgressBarSteps.ErrorStep
      }
    }
  }, [docsStatus, status])

  const checkDocuments = useCallback(async () => {
    await checkApplicationDocumentsList(application?.dcAppId ?? '', AGREEMENT_DOC_TYPES, {
      interval: 15,
      timeout: 5 * 60,
    })
    await refetchFullApplication()
  }, [application?.dcAppId, checkApplicationDocumentsList, refetchFullApplication])

  const getToSecondStage = useCallback(() => {
    const fetchAgreement = async () => {
      const res = await formContractMutate()

      if (!res.success) {
        enqueueSnackbar('Не удалось сформировать договор', { variant: 'error' })
        setDocsLoading(false)
      }

      await checkDocuments()
      setDocsLoading(false)
    }
    if (preparedStatus !== PreparedStatus.formation) {
      updateApplicationStatusLocally(StatusCode.FORMATION)
    }
    setDocsLoading(true)
    setRightsAssigned(undefined)
    fetchAgreement()
  }, [preparedStatus, formContractMutate, checkDocuments, enqueueSnackbar, updateApplicationStatusLocally])

  const returnToFirstStage = useCallback(() => {
    setDocsStatus([])
    updateApplicationStatusMutate({ statusCode: StatusCode.FINALLY_APPROVED })
  }, [updateApplicationStatusMutate])

  const changeApplicationStatusToSigned = useCallback(() => {
    updateApplicationStatusMutate({ statusCode: StatusCode.SIGNED, assignmentOfClaim: isRightsAssigned })
  }, [isRightsAssigned, updateApplicationStatusMutate])

  const handleEditBtnClick = useCallback(
    () =>
      editApplication(() => {
        const isFullCalculator = application.vendor?.vendorCode === vendorCode
        navigate(appRoutePaths.createOrder, {
          state: { isExistingApplication: true, isFullCalculator, saveDraftDisabled: true },
        })
      }),
    [application.vendor?.vendorCode, editApplication, navigate, vendorCode],
  )

  // Данный эфект необходим на случай формирования договора и быстрой перезагрузки страницы
  useEffect(() => {
    if (
      preparedStatus === PreparedStatus.formation &&
      uploadedAgreementScans.length < AGREEMENT_DOC_TYPES.length
    ) {
      if (!isDocsLoading && !isDocsFetched) {
        const check = async () => {
          setDocsLoading(true)
          await checkDocuments()
          setDocsLoading(false)
          setDocsFetched(true)
        }
        check()
      }
    }
  }, [
    preparedStatus,
    uploadedAgreementScans.length,
    isDocsLoading,
    getToSecondStage,
    checkDocuments,
    isDocsFetched,
  ])

  // Когда все обязательные документы подгружены, заканчивается ожидание формирования ПФ.
  // Всем обязательным ПФ присваиваем статус Получены
  useEffect(() => {
    if (
      preparedStatus === PreparedStatus.formation &&
      uploadedAgreementScans.length === AGREEMENT_DOC_TYPES.length &&
      !docsStatus.length
    ) {
      setDocsStatus(Array(uploadedAgreementScans.length).fill(DocsStatus.Received))
    }
  }, [docsStatus.length, preparedStatus, uploadedAgreementScans.length])

  // Когда все обязательные документы подгружены и статусы Received для них проставлены
  // (docsStatus.length === AGREEMENT_DOC_TYPES.length), всем дополнителным ПФ присваиваем статус Получены
  useEffect(() => {
    if (
      preparedStatus === PreparedStatus.formation &&
      uploadedAdditionalAgreementScans.length &&
      docsStatus.length === AGREEMENT_DOC_TYPES.length
    ) {
      setDocsStatus(prevDocStatus => [
        ...prevDocStatus,
        ...Array(uploadedAdditionalAgreementScans.length).fill(DocsStatus.Received),
      ])
    }
  }, [docsStatus.length, preparedStatus, uploadedAdditionalAgreementScans.length])

  useEffect(() => {
    if (preparedStatus === PreparedStatus.signed) {
      agreementAreaRef.current?.scrollIntoView()
    }
  }, [preparedStatus])

  return (
    <Box className={classes.blockContainer} ref={agreementAreaRef}>
      <ProgressBar {...progressBarConfig} currentStep={currentStep} />
      {preparedStatus === PreparedStatus.finallyApproved && (
        <Box className={classes.actionButtons}>
          <Button variant="contained" className={classes.button} onClick={handleEditBtnClick}>
            Редактировать
          </Button>
          {application.vendor?.vendorCode === vendorCode && (
            <Button variant="contained" className={classes.docFormButton} onClick={getToSecondStage}>
              {isStatusLoading ? <CircularProgressWheel size="small" /> : <>Сформировать договор</>}
            </Button>
          )}
        </Box>
      )}

      {preparedStatus === PreparedStatus.formation && (
        <Box>
          {isDocsLoading ? (
            <Box className={classes.loadingMessageContainer}>
              <CircularProgressWheel size="small" />
              <SberTypography className={classes.loadingMessage} sberautoVariant="body3" component="p">
                Идет формирование договора. Это может занять 2-5 мин.
              </SberTypography>
            </Box>
          ) : (
            <Box className={classes.documentsBlock}>
              {agreementDocs.map((document, index) => (
                <AgreementDocument
                  key={document?.name}
                  document={document}
                  index={index}
                  isRightsAssigned={isRightsAssigned}
                  docsStatus={docsStatus}
                  setDocsStatus={setDocsStatus}
                  setRightsAssigned={setRightsAssigned}
                  changeApplicationStatusToSigned={changeApplicationStatusToSigned}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {preparedStatus === PreparedStatus.signed && (
        <Box className={classes.documentContainer}>
          <RequisitesArea
            application={application}
            setFinancingEnabled={setFinancingEnabled}
            changeRequisites={setIsEditRequisitesMode}
          />
        </Box>
      )}
      {preparedStatus != PreparedStatus.finallyApproved && !isDocsLoading && (
        <Box className={classes.buttonsContainer}>
          <SberTypography
            sberautoVariant="body3"
            component="p"
            className={classes.textButton}
            onClick={returnToFirstStage}
          >
            Вернуться на формирование договора
          </SberTypography>
          {preparedStatus === PreparedStatus.signed && (
            <Button
              variant="contained"
              className={classes.financingButton}
              onClick={onSendToFinancing}
              disabled={!financingEnabled || isSendLoading || isRefetchFullApplicationLoading}
            >
              {isSendLoading || isRefetchFullApplicationLoading ? (
                <CircularProgressWheel size="small" />
              ) : (
                <>Отправить на финансирование</>
              )}
            </Button>
          )}
        </Box>
      )}
      <DcConfirmationModal
        actionText="Заявка будет заведена под:"
        isVisible={isConfirmationModalVisible}
        onClose={closeConfirmationModal}
        confirmedAction={confirmedAction}
      />
    </Box>
  )
}
