import React, { useCallback, useEffect } from 'react'

import { Box, Typography } from '@mui/material'
import { ApplicantDocsType } from '@sberauto/loanapplifecycledc-proto/public'
import { useField, useFormikContext } from 'formik'

import { usePrevious } from 'shared/hooks/usePrevious'
import {
  maskCyrillicAndDigits,
  maskDigitsOnly,
  maskDriverLicenseIssuedCode,
  maskINN,
  maskInternationalPassport,
  maskPassport,
  maskPensionCertificate,
} from 'shared/masks/InputMasks'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import { DOCUMENT_TYPE_VALUES } from '../../config/clientFormInitialValues'
import useStyles from './SecondDocArea.styles'

export function SecondDocArea() {
  const styles = useStyles()
  const [secondDocumentTypeField] = useField('secondDocumentType')
  const { setFieldValue } = useFormikContext()

  const prevSecondDocumentType = usePrevious(secondDocumentTypeField.value)

  const isHiddenNoInnFields = secondDocumentTypeField.value === ApplicantDocsType.INN
  const isShouldShowIssuedCodeField = secondDocumentTypeField.value === ApplicantDocsType.DRIVERLICENSE

  const maskDocumentNumber = useCallback(
    (value: string, unmasked?: boolean) => {
      switch (secondDocumentTypeField.value) {
        case ApplicantDocsType.INTERNATIONALPASSPORTFORRFCITIZENS:
          return maskInternationalPassport(value, unmasked)
        case ApplicantDocsType.DRIVERLICENSE:
          return maskPassport(value, unmasked)
        case ApplicantDocsType.PENSIONCERTIFICATE:
          return maskPensionCertificate(value, unmasked)
        case ApplicantDocsType.INN:
          return maskINN(value, unmasked)
        default:
          return maskDigitsOnly(value, unmasked)
      }
    },
    [secondDocumentTypeField.value],
  )

  useEffect(() => {
    if (secondDocumentTypeField.value !== prevSecondDocumentType) {
      setFieldValue('secondDocumentDate', null)
      setFieldValue('secondDocumentNumber', '')
      setFieldValue('secondDocumentIssuedBy', '')
      setFieldValue('secondDocumentIssuedCode', '')
    }

    //при смене типа документа стираем все поля от предыдущего
    //eslint-disable-next-line
  }, [secondDocumentTypeField.value])

  return (
    <Box className={styles.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={styles.areaLabel}>Второй документ</Typography>
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
        mask={maskDocumentNumber}
        gridColumn="span 3"
      />

      {!isHiddenNoInnFields && (
        <Box gridColumn="span 3" className={styles.dateInputContainer}>
          <DateInputFormik name="secondDocumentDate" label="Дата выдачи" gridColumn="span 3" />
        </Box>
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

      {isShouldShowIssuedCodeField && (
        <MaskedInputFormik
          name="secondDocumentIssuedCode"
          label="Код подразделения"
          placeholder="-"
          mask={maskDriverLicenseIssuedCode}
          gridColumn="span 3"
        />
      )}
    </Box>
  )
}
