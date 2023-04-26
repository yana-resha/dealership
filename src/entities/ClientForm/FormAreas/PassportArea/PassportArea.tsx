import { Box, Typography } from '@mui/material'
import { useFormikContext } from 'formik'

import {
  maskOnlyCyrillicNoDigits,
  maskDigitsOnly,
  maskDivisionCode,
  maskFullName,
  maskNoRestrictions,
  maskPassport,
} from 'shared/masks/InputMasks'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import { ClientData } from '../../utils/clientFormInitialValues'
import useStyles from './PassportArea.styles'

export function PassportArea() {
  const classes = useStyles()

  const { values } = useFormikContext<ClientData>()
  const hasNameChanged = values.hasNameChanged == 1
  const isRegAddrNotLivingAddr = values.regAddrIsLivingAddr == 0

  return (
    <Box className={classes.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={classes.areaLabel}>Паспортные данные</Typography>
      </Box>

      <MaskedInputFormik
        name="clientName"
        label="ФИО"
        placeholder="-"
        mask={maskFullName}
        gridColumn="span 12"
      />
      <SwitchInputFormik name="hasNameChanged" label="Менялось" centered gridColumn="span 4" />

      {hasNameChanged && (
        <MaskedInputFormik
          name="clientFormerName"
          label="Предыдущее ФИО"
          placeholder="-"
          mask={maskFullName}
          gridColumn="span 12"
        />
      )}
      {hasNameChanged && <Box gridColumn="span 4" />}

      <MaskedInputFormik
        name="numOfChildren"
        label="Количество детей"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 4"
      />
      <SelectInputFormik
        name="familyStatus"
        label="Семейное положение"
        placeholder="-"
        options={['Женат', 'Не женат']}
        gridColumn="span 8"
      />

      <MaskedInputFormik
        name="passport"
        label="Серия и номер паспорта"
        placeholder="-"
        mask={maskPassport}
        gridColumn="span 6"
      />
      <Box gridColumn="span 10" />

      <DateInputFormik name="birthDate" label="День рождения" gridColumn="span 6" />
      <MaskedInputFormik
        name="birthPlace"
        label="Место рождения"
        placeholder="-"
        mask={maskNoRestrictions}
        gridColumn="span 10"
      />

      <DateInputFormik name="passportDate" label="Дата выдачи" gridColumn="span 6" />
      <MaskedInputFormik
        name="divisionCode"
        label="Код подразделения"
        placeholder="-"
        mask={maskDivisionCode}
        gridColumn="span 6"
      />

      <MaskedInputFormik
        name="issuedBy"
        label="Кем выдан"
        placeholder="-"
        mask={maskOnlyCyrillicNoDigits}
        gridColumn="span 16"
      />

      <MaskedInputFormik
        name="registrationAddress"
        label="Адрес по регистрации (КЛАДР)"
        placeholder="-"
        mask={maskNoRestrictions}
        gridColumn="span 12"
      />
      <SwitchInputFormik name="regNotKladr" label="Не КЛАДР" gridColumn="span 4" centered />

      <SwitchInputFormik
        name="regAddrIsLivingAddr"
        label="Адрес проживания совпадает с адресом регистрации"
        gridColumn="span 16"
      />
      {isRegAddrNotLivingAddr && (
        <MaskedInputFormik
          name="livingAddress"
          label="Адрес проживания"
          placeholder="-"
          mask={maskNoRestrictions}
          gridColumn="span 12"
        />
      )}
      {isRegAddrNotLivingAddr && (
        <SwitchInputFormik name="livingNotKladr" label="Не КЛАДР" gridColumn="span 4" centered />
      )}

      <DateInputFormik name="regDate" label="Дата регист. по прописке" gridColumn="span 6" />
    </Box>
  )
}
