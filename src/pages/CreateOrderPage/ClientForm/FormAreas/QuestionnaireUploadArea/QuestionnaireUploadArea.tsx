import React, { useCallback } from 'react'

import { Box, Typography } from '@mui/material'
import { useField, useFormikContext } from 'formik'

import { DragAndDropWrapper } from 'shared/ui/DragAndDropWrapper/DragAndDropWrapper'
import { FileUploadButton } from 'shared/ui/FileUploadButton/FileUploadButton'
import SberTypography from 'shared/ui/SberTypography/SberTypography'
import { UploadFile } from 'shared/ui/UploadFile/UploadFile'

import { useStyles } from './QuestionnaireUploadArea.styles'

export const QuestionnaireUploadArea = () => {
  const classes = useStyles()
  const [field, meta] = useField('questionnaireFile')
  const { value } = field
  const { setFieldValue } = useFormikContext()
  const isError = meta != undefined && meta.touched && meta.error != undefined

  const uploadQuestionnaire = useCallback(
    (files: FileList) => {
      if (files.length > 0) {
        setFieldValue('questionnaireFile', files.item(0))
      }
    },
    [setFieldValue],
  )

  const deleteQuestionnaire = useCallback(() => {
    setFieldValue('questionnaireFile', null)
  }, [setFieldValue])

  return (
    <Box className={classes.uploadAreaContainer}>
      <Box className={classes.uploadQuestionnaire} gridColumn="span 12">
        <DragAndDropWrapper onChange={uploadQuestionnaire}>
          <SberTypography sberautoVariant="h6" component="p">
            Подписанная анкета
          </SberTypography>
          <SberTypography sberautoVariant="body3" component="p" className={classes.uploadInstruction}>
            Загрузите или перетащите сюда анкету подписанную клиентом в jpg, png, pdf и не более 5 мб.
          </SberTypography>
          <Box gridColumn="1 / -1">
            {value ? (
              <UploadFile
                file={value}
                loadingMessage="Анкета загружается"
                index={0}
                onClickDelete={deleteQuestionnaire}
              />
            ) : (
              <FileUploadButton
                buttonText="Загрузить анкету"
                onChange={uploadQuestionnaire}
                uniqName="uploadIncomeProof"
              />
            )}
          </Box>
          {isError && (
            <Box gridColumn="1 / -1">
              <Typography className={classes.errorMessage}>{meta.error}</Typography>
            </Box>
          )}
        </DragAndDropWrapper>
      </Box>
    </Box>
  )
}
