import React, { useCallback, useMemo, useState } from 'react'

import { Box, Button, Divider, FormHelperText } from '@mui/material'
import { DocumentType, OccupationType } from '@sberauto/loanapplifecycledc-proto/public'
import { useField, useFormikContext } from 'formik'

import { ReactComponent as AttachIcon } from 'assets/icons/attach.svg'
import { FileInfo, UploaderConfig, Uploader, DocumentUploadStatus } from 'features/ApplicationFileLoader'
import { DEFAULT_MAX_FILE_SIZE_MB } from 'shared/config/uploadFile.config'
import { ModalDialog } from 'shared/ui/ModalDialog'

import { ClientData } from '../../ClientForm.types'
import { UPLOADED_DOCUMENTS } from '../../config/clientFormInitialValues'
import useStyles from './IncomeProofUploadArea.styles'

const NDFL2_FIELD_NAME = 'ndfl2File'
const NDFL3_FIELD_NAME = 'ndfl3File'
const BANK_STATEMENT_FIELD_NAME = 'bankStatementFile'

export const IncomeProofUploadArea = () => {
  const classes = useStyles()
  const [isVisible, setIsVisible] = useState(false)
  const { setFieldValue, values, setErrors, errors } = useFormikContext<ClientData>()

  const { occupation, ndfl2File, ndfl3File, bankStatementFile, isIncomeProofUploaderTouched } = values
  const [, meta] = useField('incomeProofUploadValidator')
  const isError = meta && meta.touched && meta.error

  const openUploadDialog = useCallback(() => {
    if (occupation) {
      setIsVisible(true)
    }
    if (!isIncomeProofUploaderTouched) {
      setFieldValue('isIncomeProofUploaderTouched', true)
    }
  }, [isIncomeProofUploaderTouched, occupation, setFieldValue])

  const closeUploadDialog = useCallback(() => {
    setIsVisible(false)
  }, [setIsVisible])

  /** Фиксируем ошибку при выгрузке файла */
  const handleUploadError = useCallback(
    (documentName: string) => {
      setErrors({ [documentName]: 'Ошибка загрузки файла' })
    },
    [setErrors],
  )

  const handleUploadDocument = useCallback(
    (file: FileInfo['file'], documentName: string, status: FileInfo['status']) => {
      setFieldValue(documentName, { file, status })
      if (status === DocumentUploadStatus.Error) {
        handleUploadError(documentName)
      }
    },
    [setFieldValue, handleUploadError],
  )

  const handleDeleteDocument = useCallback(
    (documentName: string) => {
      setErrors({ [documentName]: undefined })
      setFieldValue(documentName, null)
    },
    [setFieldValue, setErrors],
  )

  const uploaderConfigs: UploaderConfig[] = useMemo(
    () => [
      {
        ...UPLOADED_DOCUMENTS[NDFL2_FIELD_NAME],
        documentFile: ndfl2File,
        documentError: errors[NDFL2_FIELD_NAME],
      },
      {
        ...UPLOADED_DOCUMENTS[NDFL3_FIELD_NAME],
        documentFile: ndfl3File,
        documentError: errors[NDFL3_FIELD_NAME],
      },
      {
        ...UPLOADED_DOCUMENTS[BANK_STATEMENT_FIELD_NAME],
        documentFile: bankStatementFile,
        documentError: errors[BANK_STATEMENT_FIELD_NAME],
      },
    ],
    [bankStatementFile, errors, ndfl2File, ndfl3File],
  )

  const filteredUploaderConfigs = useMemo(
    () =>
      uploaderConfigs.filter(config => {
        switch (occupation) {
          case OccupationType.INDIVIDUAL_ENTREPRENEUR:
            if (config.documentType === DocumentType.TWO_NDFL) {
              return false
            }
            break
          case OccupationType.WORKING_ON_A_TEMPORARY_CONTRACT:
          case OccupationType.WORKING_ON_A_PERMANENT_CONTRACT:
          case OccupationType.AGENT_ON_COMMISSION_CONTRACT:
          case OccupationType.CONTRACTOR_UNDER_CIVIL_LAW_CONTRACT:
            if (config.documentType === DocumentType.TAX_DECLARATION) {
              return false
            }
            break
          case OccupationType.PRIVATE_PRACTICE:
          case OccupationType.PENSIONER:
          case OccupationType.UNEMPLOYED:
          case OccupationType.SELF_EMPLOYED:
            if (config.documentType === DocumentType.TAX_DECLARATION) {
              return false
            }
            break
        }

        return true
      }),
    [occupation, uploaderConfigs],
  )

  const visibleFiles = useMemo(
    () => filteredUploaderConfigs.filter(el => el.documentFile),
    [filteredUploaderConfigs],
  )

  return (
    <Box gridColumn="1 / -1">
      <Button
        classes={{ root: classes.textButton, startIcon: classes.startIcon }}
        startIcon={<AttachIcon />}
        component="label"
        onClick={openUploadDialog}
      >
        Загрузить документы, подтверждающие доход
      </Button>

      {visibleFiles.map(uploaderConfig => (
        <Uploader
          key={uploaderConfig.documentLabel}
          uploaderConfig={uploaderConfig}
          onRemoveDocument={handleDeleteDocument}
        />
      ))}
      {isError && <FormHelperText error>{meta.error}</FormHelperText>}

      <ModalDialog isVisible={isVisible} label="Документы, подтверждающие доход" onClose={closeUploadDialog}>
        {filteredUploaderConfigs.map((uploaderConfig, index) => (
          <React.Fragment key={uploaderConfig.documentLabel}>
            {index > 0 && <Divider classes={{ root: classes.divider }} />}
            <Uploader
              uploaderConfig={uploaderConfig}
              suggest={`Одним документом не более ${DEFAULT_MAX_FILE_SIZE_MB} мб.`}
              loadingMessage="Документ загружается"
              motivateMessage="Загрузить документ"
              onUploadDocument={handleUploadDocument}
              onRemoveDocument={handleDeleteDocument}
              onError={handleUploadError}
            />
          </React.Fragment>
        ))}
        {isError && <FormHelperText error>{meta.error}</FormHelperText>}
      </ModalDialog>
    </Box>
  )
}
