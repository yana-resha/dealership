import { useCallback, useEffect } from 'react'

import { Box, Button } from '@mui/material'
import { useField, useFormikContext } from 'formik'

import { ReactComponent as FileIcon } from 'assets/icons/file.svg'
import { FileInfo, UploaderConfig, Uploader, DocumentUploadStatus } from 'features/ApplicationFileLoader'
import { DEFAULT_MAX_FILE_SIZE_MB } from 'shared/config/fileLoading.config'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import SberTypography from 'shared/ui/SberTypography'

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
  isSaveDraftDisabled: boolean
  onClickFormBtn: () => void
  isDisabledFormBtn: boolean
  isFormLoading: boolean
}

export const QuestionnaireUploadArea = ({
  isDifferentVendor,
  isReuploadedQuestionnaire,
  setReuploadedQuestionnaire,
  isAllowedUploadQuestionnaire,
  onUploadDocument,
  isSaveDraftDisabled,
  onClickFormBtn,
  isDisabledFormBtn,
  isFormLoading,
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
    <Box className={classes.areaWrapper}>
      <Box className={classes.areaContainer} gridColumn="span 12">
        <SberTypography sberautoVariant="h6" component="p">
          Анкета клиента
        </SberTypography>

        <Box className={classes.suggestContainer}>
          <SberTypography sberautoVariant="body3" component="p">
            Загрузите анкету клиента в формате pdf и не более {DEFAULT_MAX_FILE_SIZE_MB} мб.
          </SberTypography>
          <SberTypography sberautoVariant="body3" component="p">
            Если у Вас нет универсальной анкеты, Вы можете сформировать анкету по форме банка.
          </SberTypography>
        </Box>

        <Box className={classes.btnContainer}>
          <Box className={classes.uploaderContainer}>
            <Uploader
              uploaderConfig={uploaderConfig}
              loadingMessage="Анкета загружается"
              onUploadDocument={handleDocumentUpload}
              onRemoveDocument={onDeleteDocument}
              motivateMessage="Загрузить анкету"
              onError={handleErrorUpload}
              isAllowedUploadToServer={isAllowedUploadQuestionnaire}
            />
          </Box>
          {!isSaveDraftDisabled && (
            <Button
              variant="text"
              data-testid="createCatalogBtn"
              startIcon={
                isFormLoading ? (
                  <CircularProgressWheel size="small" />
                ) : (
                  <FileIcon className={classes.btnIcon} />
                )
              }
              className={classes.textBtn}
              onClick={onClickFormBtn}
              disabled={isDisabledFormBtn}
            >
              Сформировать анкету
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}
