import React, { useEffect } from 'react'

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
import { DateInput } from 'shared/ui/DateInput/DateInput'
import { MaskedInput } from 'shared/ui/MaskedInput/MaskedInput'
import { SelectInput } from 'shared/ui/SelectInput/SelectInput'
import { SwitchInput } from 'shared/ui/SwitchInput/SwitchInput'

import { ClientData } from '../../utils/clientFormInitialValues'
import useStyles from './PassportArea.styles'

export function PassportArea() {
  const classes = useStyles()

  const { values } = useFormikContext<ClientData>()
  const hasNameChanged = values.hasNameChanged == 1
  const isRegAddrNotLivingAddr = values.regAddrIsLivingAddr == 0

  useEffect(() => {
    if (isRegAddrNotLivingAddr) {
      values.livingAddress = ''
    } else {
      values.livingAddress = '-'
    }
  }, [isRegAddrNotLivingAddr])

  return (
    <Box className={classes.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={classes.areaLabel}>Паспортные данные</Typography>
      </Box>

      <MaskedInput name="clientName" label="ФИО" placeholder="-" mask={maskFullName} gridColumn="span 12" />
      <SwitchInput name="hasNameChanged" label="Менялось" gridColumn="span 4" centered />

      {hasNameChanged && (
        <MaskedInput
          name="clientFormerName"
          label="Предыдущее ФИО"
          placeholder="-"
          mask={maskFullName}
          gridColumn="span 12"
        />
      )}
      {hasNameChanged && <Box gridColumn="span 4" />}

      <MaskedInput
        name="numOfChildren"
        label="Количество детей"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 4"
      />
      <SelectInput
        name="familyStatus"
        label="Семейное положение"
        placeholder="-"
        options={['Женат', 'Не женат']}
        gridColumn="span 8"
      />

      <MaskedInput
        name="passport"
        label="Серия и номер паспорта"
        placeholder="-"
        mask={maskPassport}
        gridColumn="span 6"
      />
      <Box gridColumn="span 10" />

      <DateInput name="birthDate" label="День рождения" gridColumn="span 6" />
      <MaskedInput
        name="birthPlace"
        label="Место рождения"
        placeholder="-"
        mask={maskNoRestrictions}
        gridColumn="span 10"
      />

      <DateInput name="passportDate" label="Дата выдачи" gridColumn="span 6" />
      <MaskedInput
        name="divisionCode"
        label="Код подразделения"
        placeholder="-"
        mask={maskDivisionCode}
        gridColumn="span 6"
      />

      <MaskedInput
        name="issuedBy"
        label="Кем выдан"
        placeholder="-"
        mask={maskOnlyCyrillicNoDigits}
        gridColumn="span 16"
      />

      <MaskedInput
        name="registrationAddress"
        label="Адрес по регистрации (КЛАДР)"
        placeholder="-"
        mask={maskNoRestrictions}
        gridColumn="span 12"
      />
      <SwitchInput name="regNotKladr" label="Не КЛАДР" gridColumn="span 4" centered />

      <SwitchInput
        name="regAddrIsLivingAddr"
        label="Адрес проживания совпадает с адресом регистрации"
        gridColumn="span 16"
      />
      {isRegAddrNotLivingAddr && (
        <MaskedInput
          name="livingAddress"
          label="Адрес проживания"
          placeholder="-"
          mask={maskNoRestrictions}
          gridColumn="span 12"
        />
      )}
      {isRegAddrNotLivingAddr && (
        <SwitchInput name="livingNotKladr" label="Не КЛАДР" gridColumn="span 4" centered />
      )}

      <DateInput name="regDate" label="Дата регист. по прописке" gridColumn="span 6" />
    </Box>
  )
}
