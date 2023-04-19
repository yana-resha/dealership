import React, { useCallback, useState } from 'react'

import { Box, Button, InputLabel, Switch } from '@mui/material'

import { ProgressBar } from 'shared/ui/ProgressBar/ProgressBar'
import SberTypography from 'shared/ui/SberTypography'
import { UploadFile } from 'shared/ui/UploadFile/UploadFile'

import { PreparedStatus } from '../../application.utils'
import { getMockAgreement } from '../__tests__/mocks/clientDetailedDossier.mock'
import { progressBarConfig } from '../configs/clientDetailedDossier.config'
import { useStyles } from './AgreementArea.styles'

type Props = {
  status: PreparedStatus
}

const CREATE_AGREEMENT_STEP = 0
const DOWNLOAD_AGREEMENT_STEP = 1
const SIGN_AGREEMENT_STEP = 2
const SEND_TO_FINANCING_STEP = 3

export function AgreementArea({ status }: Props) {
  const classes = useStyles()
  const [currentStep, setCurrentStep] = useState(CREATE_AGREEMENT_STEP)
  const [agreementDocs, setAgreementDocs] = useState<(File | undefined)[]>([])
  const [isDocsLoading, setIsDocsLoading] = useState(false)
  const [docsStatus, setDocsStatus] = useState<string[]>([])

  const getToSecondStage = useCallback(() => {
    const fetchAgreement = async () => {
      const documents = await getMockAgreement()
      setAgreementDocs(documents)
      setIsDocsLoading(false)
      setDocsStatus(Array(documents.length).fill('received'))
    }
    setIsDocsLoading(true)
    setCurrentStep(DOWNLOAD_AGREEMENT_STEP)
    fetchAgreement()
  }, [])

  const returnToSecondStage = useCallback(() => {
    setAgreementDocs([])
    getToSecondStage()
  }, [])

  const setDocumentToDownloaded = useCallback(
    (index: number) => {
      const docStatus = [...docsStatus]
      docStatus[index] = 'downloaded'
      setDocsStatus(docStatus)
      setCurrentStep(SIGN_AGREEMENT_STEP)
    },
    [docsStatus],
  )

  const setDocumentToSigned = useCallback(
    (index: number) => {
      const docStatus = [...docsStatus]
      docStatus[index] = 'signed'
      setDocsStatus(docStatus)
      let signCounter = 0
      for (const doc of docStatus) {
        if (doc == 'signed') {
          signCounter++
        }
      }
      if (signCounter == docStatus.length) {
        setCurrentStep(SEND_TO_FINANCING_STEP)
      }
    },
    [docsStatus],
  )

  return (
    <Box className={classes.blockContainer}>
      <ProgressBar {...progressBarConfig} currentStep={currentStep} />
      {currentStep == CREATE_AGREEMENT_STEP && (
        <Box className={classes.actionButtons}>
          {status == PreparedStatus.finallyApproved && (
            <Button variant="contained" className={classes.button}>
              Редактировать
            </Button>
          )}
          <Button variant="contained" className={classes.button} onClick={getToSecondStage}>
            Сформировать договор
          </Button>
        </Box>
      )}
      {(currentStep == DOWNLOAD_AGREEMENT_STEP || currentStep == SIGN_AGREEMENT_STEP) && (
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
                <Box key={document?.name} className={classes.document}>
                  <UploadFile
                    file={document}
                    index={index}
                    loadingMessage="Файл загружается"
                    onClick={() => setDocumentToDownloaded(index)}
                  />
                  {docsStatus[index] != 'received' ? (
                    <Box className={classes.switchContainer}>
                      <Switch
                        id={'document_' + index}
                        disableRipple
                        className={classes.switch}
                        onChange={() => setDocumentToSigned(index)}
                      />
                      <InputLabel htmlFor={'document_' + index} className={classes.switchLabel}>
                        Подписан
                      </InputLabel>
                    </Box>
                  ) : (
                    <Box width="137px"> </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
      {currentStep == SEND_TO_FINANCING_STEP && (
        <Button variant="contained" className={classes.button}>
          Отправить на финансирование
        </Button>
      )}
      {currentStep > CREATE_AGREEMENT_STEP && !isDocsLoading && (
        <SberTypography
          sberautoVariant="body3"
          component="p"
          className={classes.textButton}
          onClick={returnToSecondStage}
        >
          Вернуться на формирование договора
        </SberTypography>
      )}
    </Box>
  )
}
