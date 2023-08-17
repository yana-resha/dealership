import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Box, Button, Divider } from '@mui/material'
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { useSnackbar } from 'notistack'
import { useNavigate, useParams } from 'react-router-dom'

import { getStatus, PreparedStatus } from 'entities/application/application.utils'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { useCheckDocumentsList } from 'features/ApplicationFileLoader/hooks/useCheckDocumentsList'
import { useDownloadDocument } from 'features/ApplicationFileLoader/hooks/useDownloadDocument'
import { DcConfirmationModal } from 'pages/ClientDetailedDossier/EditConfirmationModal/DcConfirmationModal'
import {
  RequiredScan,
  useFormContractMutation,
  useSendToFinancingMutation,
  useUpdateApplicationStatusMutation,
} from 'shared/api/requests/loanAppLifeCycleDc'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { appRoutePaths } from 'shared/navigation/routerPath'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel/CircularProgressWheel'
import { FileDownloader } from 'shared/ui/FileDownloader/FileDownloader'
import { ProgressBar } from 'shared/ui/ProgressBar/ProgressBar'
import { RadioGroupInput } from 'shared/ui/RadioGroupInput/RadioGroupInput'
import SberTypography from 'shared/ui/SberTypography'
import { SwitchInput } from 'shared/ui/SwitchInput/SwitchInput'

import { agreementDocTypes, progressBarConfig } from '../../config'
import { useGetFullApplicationQuery } from '../../hooks/useGetFullApplicationQuery'
import { useStyles } from './AgreementArea.styles'
import { RequisitesArea } from './RequisitesArea/RequisitesArea'

type Props = {
  status: StatusCode
  updateApplicationStatusLocally: (statusCode: StatusCode) => void
  setIsEditRequisitesMode: (value: boolean) => void
  isConfirmationModalVisible: boolean
  closeConfirmationModal: () => void
  confirmedAction?: () => void
  editApplication: (editFunction: () => void) => void
}

enum ProgressBarSteps {
  CREATE_AGREEMENT_STEP = 0,
  DOWNLOAD_AGREEMENT_STEP = 1,
  SIGN_AGREEMENT_STEP = 2,
  CHECK_REQUISITES = 3,
  ERROR_STEP = -1,
}

enum DocsStatus {
  Received = 'received',
  Downloaded = 'downloaded',
  Signed = 'signed',
}

export function AgreementArea({
  status,
  updateApplicationStatusLocally,
  setIsEditRequisitesMode,

  isConfirmationModalVisible,
  closeConfirmationModal,
  editApplication,
  confirmedAction,
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
  const [rightsAssigned, setRightsAssigned] = useState(false)
  const [financingEnabled, setFinancingEnabled] = useState(true)
  const agreementAreaRef = useRef<HTMLDivElement | undefined>()

  const { vendorCode } = getPointOfSaleFromCookies()
  const { mutateAsync: sendToFinancing, isLoading: isSendLoading } = useSendToFinancingMutation()
  const { mutate: updateApplicationStatus, isLoading: isStatusLoading } = useUpdateApplicationStatusMutation(
    application?.dcAppId ?? '',
    updateApplicationStatusLocally,
  )
  const { mutateAsync: formContractMutate } = useFormContractMutation({
    dcAppId: application?.dcAppId ?? '',
  })

  const { refetch: refetchFullApplication, isFetching: isRefetchFullApplicationLoading } =
    useGetFullApplicationQuery({ applicationId }, { enabled: false })
  const { checkApplicationDocumentsList } = useCheckDocumentsList()
  const { downloadFile } = useDownloadDocument()

  const uploadedAgreementScans = useMemo(
    () =>
      (application.scans || []).filter(scan =>
        agreementDocTypes.find(type => type === scan.type),
      ) as RequiredScan[],
    [application.scans],
  )

  const agreementDocs = useMemo(
    () =>
      status !== StatusCode.FINALLY_APPROVED
        ? uploadedAgreementScans.map(scan => ({
            dcAppId: applicationId,
            documentType: scan.type,
            name: scan.name || 'name',
          }))
        : [],
    [applicationId, status, uploadedAgreementScans],
  )

  const currentStep = useMemo(() => {
    switch (status) {
      case StatusCode.FINALLY_APPROVED: {
        return ProgressBarSteps.CREATE_AGREEMENT_STEP
      }
      case StatusCode.FORMATION: {
        return [DocsStatus.Downloaded, DocsStatus.Signed].some(value => docsStatus.includes(value))
          ? ProgressBarSteps.SIGN_AGREEMENT_STEP
          : ProgressBarSteps.DOWNLOAD_AGREEMENT_STEP
      }
      case StatusCode.SIGNED: {
        return ProgressBarSteps.CHECK_REQUISITES
      }
      default: {
        return ProgressBarSteps.ERROR_STEP
      }
    }
  }, [docsStatus, status])

  const checkDocuments = useCallback(async () => {
    await checkApplicationDocumentsList(application?.dcAppId ?? '', agreementDocTypes, {
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
    setRightsAssigned(false)
    fetchAgreement()
  }, [preparedStatus, formContractMutate, checkDocuments, enqueueSnackbar, updateApplicationStatusLocally])

  const onButtonClick = useCallback(async () => {
    const res = await sendToFinancing({
      dcAppId: application.dcAppId,
      assignmentOfClaim: rightsAssigned,
    }).catch(err => err)

    if (res.success) {
      await refetchFullApplication()
    } else {
      enqueueSnackbar('Не удалось отправить на финансирование. Попробуйте еще раз', { variant: 'error' })
    }
  }, [sendToFinancing, application.dcAppId, rightsAssigned, refetchFullApplication, enqueueSnackbar])

  useEffect(() => {
    if (
      preparedStatus === PreparedStatus.formation &&
      uploadedAgreementScans.length < agreementDocTypes.length
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

  useEffect(() => {
    if (
      preparedStatus === PreparedStatus.formation &&
      uploadedAgreementScans.length === agreementDocTypes.length &&
      !docsStatus.length
    ) {
      setDocsStatus(Array(uploadedAgreementScans.length).fill(DocsStatus.Received))
    }
  }, [docsStatus.length, preparedStatus, uploadedAgreementScans.length])

  useEffect(() => {
    if (preparedStatus === PreparedStatus.signed) {
      agreementAreaRef.current?.scrollIntoView()
    }
  }, [preparedStatus])

  const returnToFirstStage = useCallback(() => {
    setDocsStatus([])
    updateApplicationStatus(StatusCode.FINALLY_APPROVED)
  }, [updateApplicationStatus])

  const setDocumentToDownloaded = useCallback(
    (index: number) => {
      const docStatus = [...docsStatus]
      docStatus[index] = DocsStatus.Downloaded
      setDocsStatus(docStatus)
    },
    [docsStatus, setDocsStatus],
  )

  const updateDocumentStatus = useCallback(
    (checked: boolean, index: number) => {
      const docStatus = [...docsStatus]
      docStatus[index] = checked ? DocsStatus.Signed : DocsStatus.Downloaded
      setDocsStatus(docStatus)
      let signCounter = 0
      for (const doc of docStatus) {
        if (doc === DocsStatus.Signed) {
          signCounter++
        }
      }
      if (signCounter === docStatus.length) {
        updateApplicationStatus(StatusCode.SIGNED)
      }
    },
    [docsStatus, setDocsStatus, updateApplicationStatus],
  )

  const changeRightsAssigned = useCallback(
    (value: boolean) => {
      if (!value) {
        updateDocumentStatus(false, 0)
      }
      setRightsAssigned(value)
    },
    [updateDocumentStatus, setRightsAssigned],
  )

  const editApplicationWithFinallyApprovedStatus = useCallback(() => {
    const isFullCalculator = application.vendor?.vendorCode === vendorCode
    navigate(appRoutePaths.createOrder, {
      state: { isFullCalculator, saveDraftDisabled: true },
    })
  }, [application.vendor?.vendorCode, vendorCode, navigate])

  return (
    <Box className={classes.blockContainer} ref={agreementAreaRef}>
      <ProgressBar {...progressBarConfig} currentStep={currentStep} />
      {preparedStatus === PreparedStatus.finallyApproved && (
        <Box className={classes.actionButtons}>
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => editApplication(editApplicationWithFinallyApprovedStatus)}
          >
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
            <FileDownloader
              file={undefined}
              index={0}
              loadingMessage="Идет формирование договора. Это может занять 2-5 мин."
            />
          ) : (
            <Box className={classes.documentsBlock}>
              {agreementDocs.map((document, index) => (
                <Box key={document?.name} className={classes.documentContainer}>
                  <Box className={classes.document}>
                    <FileDownloader
                      file={document}
                      index={index}
                      loadingMessage="Файл загружается"
                      onClick={() => setDocumentToDownloaded(index)}
                      onDownloadFile={downloadFile}
                    />

                    {docsStatus[index] !== DocsStatus.Received && (
                      <SwitchInput
                        label="Подписан"
                        id={'document_' + index}
                        value={docsStatus[index] === 'signed'}
                        disabled={index === 0 && !rightsAssigned}
                        afterChange={event => updateDocumentStatus(event.target.checked, index)}
                      />
                    )}
                  </Box>
                  {index === 0 && docsStatus[index] !== DocsStatus.Received && (
                    <Box className={classes.radioGroup}>
                      <SberTypography sberautoVariant="body2" component="p">
                        Согласие на уступку прав
                      </SberTypography>
                      <RadioGroupInput
                        radioValues={[
                          { radioValue: true, radioLabel: 'Согласен' },
                          { radioValue: false, radioLabel: 'Не согласен' },
                        ]}
                        defaultValue={false}
                        onChange={changeRightsAssigned}
                      />
                    </Box>
                  )}
                  {docsStatus[index] !== DocsStatus.Received && <Divider />}
                </Box>
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
              onClick={onButtonClick}
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
