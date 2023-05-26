import React, { useCallback, useEffect, useState } from 'react'

import { Box } from '@mui/material'

import { FileUploadButton } from 'shared/ui/FileUploadButton/FileUploadButton'
import SberTypography from 'shared/ui/SberTypography'
import { UploadFile } from 'shared/ui/UploadFile/UploadFile'

import { PreparedStatus } from '../../../application.utils'
import { getMockAgreement } from '../../__tests__/mocks/clientDetailedDossier.mock'
import { useStyles } from './DocumentsArea.styles'

type Props = {
  fileQuestionnaire: File | undefined
  setQuestionnaire: (file: File | undefined) => void
  agreementDocs: (File | undefined)[]
  setAgreementDocs: (files: (File | undefined)[]) => void
  status: PreparedStatus
}

export function DocumentsArea(props: Props) {
  const classes = useStyles()
  const { fileQuestionnaire, setQuestionnaire, agreementDocs, setAgreementDocs, status } = props
  const [isDocsLoading, setIsDocsLoading] = useState(false)
  const showDownloadLoanAgreement = [
    PreparedStatus.authorized,
    PreparedStatus.financed,
    PreparedStatus.signed,
  ].includes(status)

  useEffect(() => {
    const fetchAgreement = async () => {
      const documents = await getMockAgreement()
      setAgreementDocs(documents)
      setIsDocsLoading(false)
    }
    if (showDownloadLoanAgreement && !agreementDocs.length) {
      setIsDocsLoading(true)
      fetchAgreement()
    }
  }, [showDownloadLoanAgreement])

  const uploadQuestionnaire = useCallback((files: FileList) => {
    if (files.length > 0) {
      setQuestionnaire(files[0])
    }
  }, [])

  const deleteQuestionnaire = useCallback(() => {
    setQuestionnaire(undefined)
  }, [])

  return (
    <Box className={classes.blockContainer}>
      <SberTypography sberautoVariant="h5" component="p">
        Документы
      </SberTypography>
      {status == PreparedStatus.initial ? (
        <Box gridColumn="1 / -1">
          {fileQuestionnaire ? (
            <UploadFile
              file={fileQuestionnaire}
              loadingMessage="Анкета загружается"
              index={0}
              onClickDelete={deleteQuestionnaire}
            />
          ) : (
            <FileUploadButton
              buttonText="Загрузить анкету"
              onChange={uploadQuestionnaire}
              uniqName="uploadQuestionnaire"
            />
          )}
        </Box>
      ) : (
        <Box gridColumn="1 / -1">
          <UploadFile file={fileQuestionnaire} index={0} loadingMessage="Анкета загружается" />
        </Box>
      )}

      {showDownloadLoanAgreement && (
        <Box gridColumn="1 / -1">
          {isDocsLoading ? (
            <UploadFile
              file={undefined}
              index={0}
              loadingMessage="Идет формирование договора. Это может занять 2-5 мин."
            />
          ) : (
            <Box className={classes.documentsBlock}>
              {agreementDocs.map((document, index) => (
                <UploadFile key={index} file={document} index={index} loadingMessage="Файл загружается" />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
