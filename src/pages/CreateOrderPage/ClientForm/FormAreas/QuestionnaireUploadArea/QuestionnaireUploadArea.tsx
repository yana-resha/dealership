import { useCallback } from 'react'

import { Box } from '@mui/material'
import { useField, useFormikContext } from 'formik'

import { FileInfo, UploaderConfig, Uploader, DocumentUploadStatus } from 'features/ApplicationFileLoader'
import { MAX_FILE_SIZE_MB } from 'shared/config/uploadFile.config'

import { ClientData } from '../../ClientForm.types'
import { UPLOADED_DOCUMENTS } from '../../config/clientFormInitialValues'
import { useStyles } from './QuestionnaireUploadArea.styles'

const FIELD_NAME = 'questionnaireFile'

export const QuestionnaireUploadArea = () => {
  const classes = useStyles()

  const [field, meta] = useField(FIELD_NAME)
  const { value } = field
  const { setFieldValue, setErrors } = useFormikContext<ClientData>()

  /** Фиксируем ошибку при выгрузке файла */
  const onUploadError = useCallback(
    (documentName: string) => {
      setErrors({ [documentName]: 'Ошибка загрузки файла' })
    },
    [setErrors],
  )

  const onUploadDocument = useCallback(
    (file: FileInfo['file'], documentName: string, status: FileInfo['status']) => {
      setFieldValue(documentName, { file, status })
      if (status === DocumentUploadStatus.Error) {
        onUploadError(documentName)
      }
    },
    [onUploadError, setFieldValue],
  )

  const onDeleteDocument = useCallback(
    (documentName: string) => {
      setErrors({ [documentName]: undefined })
      setFieldValue(documentName, null)
    },
    [setErrors, setFieldValue],
  )

  const uploaderConfig: UploaderConfig = {
    ...UPLOADED_DOCUMENTS[FIELD_NAME],
    documentFile: value,
    documentError: meta.error,
  }

  return (
    <Box className={classes.uploadAreaContainer}>
      <Box className={classes.uploadQuestionnaire} gridColumn="span 12">
        <Uploader
          uploaderConfig={uploaderConfig}
          suggest={`Загрузите или перетащите сюда анкету подписанную клиентом в jpg, png, pdf и не более ${MAX_FILE_SIZE_MB} мб.`}
          loadingMessage="Анкета загружается"
          motivateMessage="Загрузить анкету"
          onUploadDocument={onUploadDocument}
          onDeleteDocument={onDeleteDocument}
          onError={onUploadError}
        />
      </Box>
    </Box>
  )
}
