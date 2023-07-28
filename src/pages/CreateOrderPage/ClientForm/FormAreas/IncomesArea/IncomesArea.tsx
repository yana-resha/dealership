import { useEffect } from 'react'

import { Box, Typography } from '@mui/material'
import { useFormikContext } from 'formik'

import { maskDigitsOnly } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import SberTypography from 'shared/ui/SberTypography/SberTypography'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import { ClientData } from '../../ClientForm.types'
import { IncomeProofUploadArea } from '../IncomeProofUploadArea/IncomeProofUploadArea'
import useStyles from './IncomesArea.styles'

export function IncomesArea() {
  const classes = useStyles()
  const { values, setFieldValue, setFieldTouched } = useFormikContext<ClientData>()
  const { occupation, incomeConfirmation } = values

  useEffect(() => {
    if (!incomeConfirmation) {
      setFieldValue('ndfl2File', null)
      setFieldValue('ndfl3File', null)
      setFieldValue('bankStatementFile', null)
    }
  }, [incomeConfirmation, setFieldValue])

  useEffect(() => {
    if (incomeConfirmation && !occupation) {
      setFieldTouched('occupation', true)
    }
  }, [incomeConfirmation, occupation, setFieldTouched])

  return (
    <Box className={classes.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={classes.areaLabel}>Доходы</Typography>
      </Box>

      <MaskedInputFormik
        name="averageIncome"
        label="Среднемесячный доход"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 4"
      />
      <MaskedInputFormik
        name="additionalIncome"
        label="Дополнительный личный доход"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 4"
      />
      <SwitchInputFormik name="incomeConfirmation" label="Подтверждение" centered gridColumn="span 8" />

      {incomeConfirmation && occupation && <IncomeProofUploadArea />}

      {incomeConfirmation && !occupation && (
        <Box className={classes.docError} gridColumn="1/-1">
          <SberTypography sberautoVariant="body3" component="p" data-testid="hasNotOccupationErr">
            Перед загрузкой подтверждения заполните поле &quot;Должность/Вид занятости&quot;
          </SberTypography>
        </Box>
      )}

      <MaskedInputFormik
        name="familyIncome"
        label="Доход семьи без дохода заявит."
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 4"
      />
      <MaskedInputFormik
        name="expenses"
        label="Общие расходы"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 4"
      />
      <Box gridColumn="span 8" />
      <SelectInputFormik
        name="relatedToPublic"
        label="Принадлежность клиента к категории публичных лиц"
        placeholder="-"
        options={[
          { label: 'Нет', value: 0 },
          { label: 'Да', value: 1 },
        ]}
        gridColumn="span 7"
      />
      <Box gridColumn="span 9" />
    </Box>
  )
}
