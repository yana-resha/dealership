import React, { useEffect } from 'react'

import { Box, Typography } from '@mui/material'
import { ApplicantDocsType } from '@sberauto/loanapplifecycledc-proto/public'
import { useField, useFormikContext } from 'formik'

import { usePrevious } from 'shared/hooks/usePrevious'
import { maskCyrillicAndDigits, maskDigitsOnly } from 'shared/masks/InputMasks'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import { DOCUMENT_TYPE_VALUES } from '../../config/clientFormInitialValues'
import useStyles from './SecondDocArea.styles'

export function SecondDocArea() {
  const classes = useStyles()
  const [secondDocumentTypeField] = useField('secondDocumentType')
  const { setFieldValue } = useFormikContext()

  const prevSecondDocumentType = usePrevious(secondDocumentTypeField.value)

  const isHiddenNoInnFields = secondDocumentTypeField.value === ApplicantDocsType.INN

  useEffect(() => {
    if (secondDocumentTypeField.value !== prevSecondDocumentType) {
      setFieldValue('secondDocumentDate', null)
      setFieldValue('secondDocumentIssuedBy', '')
      setFieldValue('secondDocumentNumber', '')
    }

    //при смене типа документа стираем все поля от предыдущего
    //eslint-disable-next-line
  }, [secondDocumentTypeField.value])

  return (
    <Box className={classes.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={classes.areaLabel}>Второй документ</Typography>
      </Box>

      <SelectInputFormik
        name="secondDocumentType"
        label="Тип второго документа"
        placeholder="-"
        options={DOCUMENT_TYPE_VALUES}
        gridColumn="span 8"
      />
      <Box gridColumn="span 8" />

      <MaskedInputFormik
        name="secondDocumentNumber"
        label="Серия и номер"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 3"
      />
      {!isHiddenNoInnFields && (
        <DateInputFormik
          name="secondDocumentDate"
          label="Дата выдачи второго документа"
          gridColumn="span 2"
        />
      )}

      {!isHiddenNoInnFields && (
        <MaskedInputFormik
          name="secondDocumentIssuedBy"
          label="Кем выдан"
          placeholder="-"
          mask={maskCyrillicAndDigits}
          gridColumn="span 7"
        />
      )}
    </Box>
  )
}
