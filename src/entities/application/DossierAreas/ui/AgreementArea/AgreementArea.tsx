import { useCallback, useEffect, useRef, useState } from 'react'

import { Box, Button, Divider } from '@mui/material'
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { ProgressBar } from 'shared/ui/ProgressBar/ProgressBar'
import { RadioGroupInput } from 'shared/ui/RadioGroupInput/RadioGroupInput'
import SberTypography from 'shared/ui/SberTypography'
import { SwitchInput } from 'shared/ui/SwitchInput/SwitchInput'
import { UploadFile } from 'shared/ui/UploadFile/UploadFile'

import { RequisitesArea } from '../'
import { getStatus, PreparedStatus } from '../../../application.utils'
import { ClientDossier, getMockAgreement } from '../../__tests__/mocks/clientDetailedDossier.mock'
import { progressBarConfig } from '../../configs/clientDetailedDossier.config'
import { useStyles } from './AgreementArea.styles'

type Props = {
  clientDossier: ClientDossier
  updateStatus: (statusCode: StatusCode) => void
  agreementDocs: (File | undefined)[]
  setAgreementDocs: (files: (File | undefined)[]) => void
  setIsEditRequisitesMode: (value: boolean) => void
}

const CREATE_AGREEMENT_STEP = 0
const DOWNLOAD_AGREEMENT_STEP = 1
const SIGN_AGREEMENT_STEP = 2
const CHECK_REQUISITES = 3

export function AgreementArea(props: Props) {
  const { clientDossier, updateStatus, agreementDocs, setAgreementDocs, setIsEditRequisitesMode } = props
  const classes = useStyles()
  const status = getStatus(clientDossier.status)
  const { additionalOptions, creditSum, creditReceiverBank, creditBankAccountNumber, creditLegalEntity } =
    clientDossier
  const [currentStep, setCurrentStep] = useState(CREATE_AGREEMENT_STEP)
  const [isDocsLoading, setIsDocsLoading] = useState(false)
  const [docsStatus, setDocsStatus] = useState<string[]>([])
  const [rightsAssigned, setRightsAssigned] = useState(false)
  const [financingEnabled, setFinancingEnabled] = useState(true)
  const agreementAreaRef = useRef<HTMLDivElement | undefined>()

  const getToSecondStage = useCallback(() => {
    const fetchAgreement = async () => {
      const documents = await getMockAgreement()
      setAgreementDocs(documents)
      setIsDocsLoading(false)
      setDocsStatus(Array(documents.length).fill('received'))
    }
    if (status != PreparedStatus.formation) {
      updateStatus(StatusCode.FORMATION)
    }
    setIsDocsLoading(true)
    setCurrentStep(DOWNLOAD_AGREEMENT_STEP)
    setRightsAssigned(false)
    fetchAgreement()
  }, [updateStatus, setAgreementDocs, status])

  useEffect(() => {
    if (status == PreparedStatus.formation) {
      getToSecondStage()
    } else if (status == PreparedStatus.signed) {
      setCurrentStep(CHECK_REQUISITES)
      agreementAreaRef.current?.scrollIntoView()
    }
  }, [status, getToSecondStage])

  const returnToFirstStage = useCallback(() => {
    setAgreementDocs([])
    updateStatus(StatusCode.FINALLY_APPROVED)
    setCurrentStep(CREATE_AGREEMENT_STEP)
  }, [setAgreementDocs, getToSecondStage])

  const setDocumentToDownloaded = useCallback(
    (index: number) => {
      const docStatus = [...docsStatus]
      docStatus[index] = 'downloaded'
      setDocsStatus(docStatus)
      setCurrentStep(SIGN_AGREEMENT_STEP)
    },
    [docsStatus, setDocsStatus, setCurrentStep],
  )

  const updateDocumentStatus = useCallback(
    (checked: boolean, index: number) => {
      const docStatus = [...docsStatus]
      docStatus[index] = checked ? 'signed' : 'downloaded'
      setDocsStatus(docStatus)
      let signCounter = 0
      for (const doc of docStatus) {
        if (doc == 'signed') {
          signCounter++
        }
      }
      if (signCounter == docStatus.length) {
        updateStatus(StatusCode.SIGNED)
        setCurrentStep(CHECK_REQUISITES)
      }
    },
    [docsStatus, setDocsStatus, updateStatus],
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

  return (
    <Box className={classes.blockContainer} ref={agreementAreaRef}>
      <ProgressBar {...progressBarConfig} currentStep={currentStep} />
      {status == PreparedStatus.finallyApproved && (
        <Box className={classes.actionButtons}>
          <Button variant="contained" className={classes.button}>
            Редактировать
          </Button>
          <Button variant="contained" className={classes.button} onClick={getToSecondStage}>
            Сформировать договор
          </Button>
        </Box>
      )}

      {status == PreparedStatus.formation && (
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
                        value={docsStatus[index] == 'signed'}
                        disabled={index == 0 && !rightsAssigned}
                        afterChange={event => updateDocumentStatus(event.target.checked, index)}
                      />
                    ) : (
                      <Box width="137px"> </Box>
                    )}
                  </Box>
                  {index == 0 && docsStatus[index] != 'received' && (
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

      {status == PreparedStatus.signed && (
        <Box className={classes.documentContainer}>
          <RequisitesArea
            additionalOptions={additionalOptions}
            creditSum={creditSum}
            creditLegalEntity={creditLegalEntity}
            creditBankAccountNumber={creditBankAccountNumber}
            creditReceiverBank={creditReceiverBank}
            setFinancingEnabled={setFinancingEnabled}
            changeRequisites={setIsEditRequisitesMode}
          />
        </Box>
      )}
      {status != PreparedStatus.finallyApproved && !isDocsLoading && (
        <Box className={classes.buttonsContainer}>
          <SberTypography
            sberautoVariant="body3"
            component="p"
            className={classes.textButton}
            onClick={returnToFirstStage}
          >
            Вернуться на формирование договора
          </SberTypography>
          {status == PreparedStatus.signed && (
            <Button variant="contained" className={classes.button} disabled={!financingEnabled}>
              Отправить на финансирование
            </Button>
          )}
        </Box>
      )}
    </Box>
  )
}
