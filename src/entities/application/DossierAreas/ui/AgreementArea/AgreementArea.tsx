import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Box, Button, Divider } from '@mui/material'
import { ApplicationFrontdc, StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { useNavigate } from 'react-router-dom'

import {
  useSendToFinancingMutation,
  useUpdateApplicationStatus,
} from 'shared/api/requests/loanAppLifeCycleDc'
import { appRoutePaths } from 'shared/navigation/routerPath'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel/CircularProgressWheel'
import { ProgressBar } from 'shared/ui/ProgressBar/ProgressBar'
import { RadioGroupInput } from 'shared/ui/RadioGroupInput/RadioGroupInput'
import SberTypography from 'shared/ui/SberTypography'
import { SwitchInput } from 'shared/ui/SwitchInput/SwitchInput'
import { UploadFile } from 'shared/ui/UploadFile/UploadFile'

import { RequisitesArea } from '../'
import { getPointOfSaleFromCookies } from '../../../../pointOfSale'
import { getStatus, PreparedStatus } from '../../../application.utils'
import { getMockAgreement } from '../../__tests__/mocks/clientDetailedDossier.mock'
import { progressBarConfig } from '../../configs/clientDetailedDossier.config'
import { useStyles } from './AgreementArea.styles'

type Props = {
  status: StatusCode
  application: ApplicationFrontdc
  updateApplicationStatusLocally: (statusCode: StatusCode) => void
  agreementDocs: (File | undefined)[]
  setAgreementDocs: (files: (File | undefined)[]) => void
  setIsEditRequisitesMode: (value: boolean) => void
}

enum ProgressBarSteps {
  CREATE_AGREEMENT_STEP = 0,
  DOWNLOAD_AGREEMENT_STEP = 1,
  SIGN_AGREEMENT_STEP = 2,
  CHECK_REQUISITES = 3,
  ERROR_STEP = -1,
}

export function AgreementArea({
  status,
  application,
  agreementDocs,
  updateApplicationStatusLocally,
  setAgreementDocs,
  setIsEditRequisitesMode,
}: Props) {
  const classes = useStyles()
  const preparedStatus = getStatus(status)

  const navigate = useNavigate()
  const [isDocsLoading, setIsDocsLoading] = useState(false)
  const [docsStatus, setDocsStatus] = useState<string[]>([])
  const [rightsAssigned, setRightsAssigned] = useState(false)
  const [financingEnabled, setFinancingEnabled] = useState(true)
  const agreementAreaRef = useRef<HTMLDivElement | undefined>()
  const { vendorCode } = getPointOfSaleFromCookies()
  const { mutate: sendToFinancing, isLoading: isSendLoading } = useSendToFinancingMutation()
  const { mutate: updateApplicationStatus, isLoading: isStatusLoading } = useUpdateApplicationStatus(
    application?.dcAppId ?? '',
    updateApplicationStatusLocally,
  )

  const currentStep = useMemo(() => {
    switch (status) {
      case StatusCode.FINALLY_APPROVED: {
        return ProgressBarSteps.CREATE_AGREEMENT_STEP
      }
      case StatusCode.FORMATION: {
        return ['downloaded', 'signed'].some(value => docsStatus.includes(value))
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

  const getToSecondStage = useCallback(() => {
    const fetchAgreement = async () => {
      const documents = await getMockAgreement()
      setAgreementDocs(documents)
      setIsDocsLoading(false)
      setDocsStatus(Array(documents.length).fill('received'))
    }
    if (preparedStatus != PreparedStatus.formation) {
      updateApplicationStatusLocally(StatusCode.FORMATION)
    }
    setIsDocsLoading(true)
    setRightsAssigned(false)
    fetchAgreement()
  }, [updateApplicationStatus, setAgreementDocs, preparedStatus])

  const onButtonClick = useCallback(() => {
    sendToFinancing({
      dcAppId: application.dcAppId,
      assignmentOfClaim: rightsAssigned,
    })
  }, [application.dcAppId, sendToFinancing, rightsAssigned])

  useEffect(() => {
    if (preparedStatus === PreparedStatus.formation) {
      getToSecondStage()
    } else if (preparedStatus === PreparedStatus.signed) {
      agreementAreaRef.current?.scrollIntoView()
    }
    // Если присутствует getToSecondState, то происходит зацикливание
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preparedStatus, agreementAreaRef.current])

  const returnToFirstStage = useCallback(() => {
    setAgreementDocs([])
    setDocsStatus([])
    updateApplicationStatus(StatusCode.FINALLY_APPROVED)
  }, [setAgreementDocs, updateApplicationStatus])

  const setDocumentToDownloaded = useCallback(
    (index: number) => {
      const docStatus = [...docsStatus]
      docStatus[index] = 'downloaded'
      setDocsStatus(docStatus)
    },
    [docsStatus, setDocsStatus],
  )

  const updateDocumentStatus = useCallback(
    (checked: boolean, index: number) => {
      const docStatus = [...docsStatus]
      docStatus[index] = checked ? 'signed' : 'downloaded'
      setDocsStatus(docStatus)
      let signCounter = 0
      for (const doc of docStatus) {
        if (doc === 'signed') {
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
            onClick={editApplicationWithFinallyApprovedStatus}
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
            <UploadFile
              file={undefined}
              index={0}
              loadingMessage="Идет формирование договора. Это может занять 2-5 мин."
            />
          ) : (
            <Box className={classes.documentsBlock}>
              {agreementDocs.map((document, index) => (
                <Box key={document?.name} className={classes.documentContainer}>
                  <Box className={classes.document}>
                    <UploadFile
                      file={document}
                      index={index}
                      loadingMessage="Файл загружается"
                      onClick={() => setDocumentToDownloaded(index)}
                    />
                    {docsStatus[index] != 'received' ? (
                      <SwitchInput
                        label="Подписан"
                        id={'document_' + index}
                        value={docsStatus[index] === 'signed'}
                        disabled={index === 0 && !rightsAssigned}
                        afterChange={event => updateDocumentStatus(event.target.checked, index)}
                      />
                    ) : (
                      <Box width="137px"> </Box>
                    )}
                  </Box>
                  {index === 0 && docsStatus[index] != 'received' && (
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
                  {docsStatus[index] != 'received' && <Divider />}
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
              disabled={!financingEnabled || isSendLoading}
            >
              {isSendLoading ? <CircularProgressWheel size="small" /> : <>Отправить на финансирование</>}
            </Button>
          )}
        </Box>
      )}
    </Box>
  )
}
