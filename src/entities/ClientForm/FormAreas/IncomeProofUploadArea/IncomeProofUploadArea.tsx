import React, { useCallback, useState } from 'react'

import { Box, Button, Divider, FormHelperText } from '@mui/material'
import { useField, useFormikContext } from 'formik'

import { ReactComponent as AttachIcon } from 'assets/icons/attach.svg'
import { DragAndDropWrapper } from 'shared/ui/DragAndDropWrapper/DragAndDropWrapper'
import { FileUploadButton } from 'shared/ui/FileUploadButton/FileUploadButton'
import { ModalDialog } from 'shared/ui/ModalDialog/ModalDialog'
import SberTypography from 'shared/ui/SberTypography'
import { UploadFile } from 'shared/ui/UploadFile/UploadFile'

import { ClientData } from '../../config/clientFormInitialValues'
import useStyles from './IncomeProofUploadArea.styles'

const NDFL2 = 'ndfl2File'
const NDFL3 = 'ndfl3File'
const BANK_STATEMENT = 'bankStatementFile'

export const IncomeProofUploadArea = () => {
  const classes = useStyles()
  const [isVisible, setIsVisible] = useState(false)
  const { setFieldValue, values } = useFormikContext<ClientData>()
  const { ndfl2File, ndfl3File, bankStatementFile } = values
  const [, meta] = useField('incomeProofUploadValidator')
  const isError = meta && meta.touched && meta.error

  const openUploadDialog = useCallback(() => {
    setIsVisible(true)
  }, [setIsVisible])

  const closeUploadDialog = useCallback(() => {
    setIsVisible(false)
  }, [setIsVisible])

  const uploadDocument = useCallback(
    (files: FileList, documentName: string) => {
      if (files.length > 0) {
        setFieldValue(documentName, files.item(0))
      }
    },
    [setFieldValue],
  )

  const deleteDocument = useCallback(
    (documentName: string) => {
      setFieldValue(documentName, null)
    },
    [setFieldValue],
  )

  const uploaderConfig = [
    {
      documentLabel: '2НДФЛ',
      documentName: NDFL2,
      document: ndfl2File,
    },
    {
      documentLabel: '3НДФЛ',
      documentName: NDFL3,
      document: ndfl3File,
    },
    {
      documentLabel: 'Выписка из банка',
      documentName: BANK_STATEMENT,
      document: bankStatementFile,
    },
  ]

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
      {uploaderConfig.map(section => (
        <Box key={section.documentName}>
          {section.document != null && (
            <Box className={classes.documentPreview}>
              <SberTypography sberautoVariant="body3" component="p">
                {section.documentLabel}
              </SberTypography>
              <UploadFile
                file={section.document}
                loadingMessage="Документ загружается"
                index={0}
                onClickDelete={() => deleteDocument(section.documentName)}
              />
            </Box>
          )}
        </Box>
      ))}
      <ModalDialog isVisible={isVisible} label="Документы, подтверждающие доход" onClose={closeUploadDialog}>
        {uploaderConfig.map(section => (
          <Box className={classes.documentSection} key={section.documentLabel}>
            <DragAndDropWrapper onChange={(files: FileList) => uploadDocument(files, section.documentName)}>
              <SberTypography sberautoVariant="h6" component="p">
                {section.documentLabel}
              </SberTypography>
              <SberTypography sberautoVariant="body3" component="p" className={classes.sectionInfo}>
                Одним документом не более 5 мб.
              </SberTypography>

              <Box gridColumn="1 / -1">
                {section.document != null ? (
                  <UploadFile
                    file={section.document}
                    loadingMessage="Документ загружается"
                    index={0}
                    onClickDelete={() => deleteDocument(section.documentName)}
                  />
                ) : (
                  <FileUploadButton
                    buttonText="Загрузить документ"
                    onChange={(files: FileList) => uploadDocument(files, section.documentName)}
                    uniqName="uploadIncomeProof"
                  />
                )}
              </Box>
            </DragAndDropWrapper>
            <Divider classes={{ root: classes.divider }} />
          </Box>
        ))}
        {isError && <FormHelperText error>{meta.error}</FormHelperText>}
      </ModalDialog>
      {isError && <FormHelperText error>{meta.error}</FormHelperText>}
    </Box>
  )
}
