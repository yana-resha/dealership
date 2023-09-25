import { useCallback, useEffect, useState } from 'react'

import { Box } from '@mui/material'
import { useField, useFormikContext } from 'formik'

import { FileInfo, UploaderConfig, Uploader, DocumentUploadStatus } from 'features/ApplicationFileLoader'
import { DEFAULT_MAX_FILE_SIZE_MB } from 'shared/config/uploadFile.config'

import { ClientData } from '../../ClientForm.types'
import { UPLOADED_DOCUMENTS } from '../../config/clientFormInitialValues'
import { useStyles } from './QuestionnaireUploadArea.styles'

export const QUESTIONNAIRE_FIELD_NAME = 'questionnaireFile'

interface Props {
  isDifferentVendor: boolean
  isReuploadedQuestionnaire: boolean
  setReuploadedQuestionnaire: React.Dispatch<React.SetStateAction<boolean>>
  isAllowedUploadQuestionnaire: boolean
  onUploadDocument: (() => void) | undefined
}

export const QuestionnaireUploadArea = ({
  isDifferentVendor,
  isReuploadedQuestionnaire,
  setReuploadedQuestionnaire,
  isAllowedUploadQuestionnaire,
  onUploadDocument,
}: Props) => {
  const classes = useStyles()

  const [{ value }, meta] = useField<FileInfo | null>(QUESTIONNAIRE_FIELD_NAME)
  const { setFieldValue, setErrors } = useFormikContext<ClientData>()

  /** Фиксируем ошибку при выгрузке файла */
  const handleErrorUpload = useCallback(
    (documentName: string) => {
      setErrors({ [documentName]: 'Ошибка загрузки файла' })
    },
    [setErrors],
  )

  const handleDocumentUpload = useCallback(
    (file: FileInfo['file'], documentName: string, status: FileInfo['status']) => {
      setFieldValue(documentName, { file, status })
      if (status === DocumentUploadStatus.Error) {
        handleErrorUpload(documentName)
      }
      if (status === DocumentUploadStatus.Local) {
        setReuploadedQuestionnaire(true)
      }
      if (status === DocumentUploadStatus.Sended) {
        onUploadDocument?.()
      }
    },
    [handleErrorUpload, onUploadDocument, setFieldValue, setReuploadedQuestionnaire],
  )

  const onDeleteDocument = useCallback(
    (documentName: string) => {
      setErrors({ [documentName]: undefined })
      setFieldValue(documentName, null)
    },
    [setErrors, setFieldValue],
  )

  useEffect(() => {
    if (isDifferentVendor && !isReuploadedQuestionnaire) {
      setFieldValue(QUESTIONNAIRE_FIELD_NAME, null)
    }
  }, [isReuploadedQuestionnaire, isDifferentVendor, setFieldValue])

  const uploaderConfig: UploaderConfig = {
    ...UPLOADED_DOCUMENTS[QUESTIONNAIRE_FIELD_NAME],
    documentFile: value,
    documentError: meta.error,
  }

  return (
    <Box className={classes.uploadAreaContainer}>
      <Box className={classes.uploadQuestionnaire} gridColumn="span 12">
        <Uploader
          uploaderConfig={uploaderConfig}
          suggest={`Загрузите или перетащите сюда анкету подписанную клиентом в jpg, png, pdf и не более ${DEFAULT_MAX_FILE_SIZE_MB} мб.`}
          loadingMessage="Анкета загружается"
          motivateMessage="Загрузить анкету"
          onUploadDocument={handleDocumentUpload}
          onDeleteDocument={onDeleteDocument}
          onError={handleErrorUpload}
          isAllowedUploadToServer={isAllowedUploadQuestionnaire}
        />
      </Box>
    </Box>
  )
}
