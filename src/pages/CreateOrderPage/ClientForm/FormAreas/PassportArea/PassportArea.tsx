import React, { useCallback, useState } from 'react'

import { Box, Typography } from '@mui/material'
import { useFormikContext } from 'formik'

import {
  maskOnlyCyrillicNoDigits,
  maskDigitsOnly,
  maskDivisionCode,
  maskFullName,
  maskNoRestrictions,
  maskPassport,
  maskCyrillicAndDigits,
} from 'shared/masks/InputMasks'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import { ClientData } from '../../ClientForm.types'
import { configAddressInitialValues } from '../../config/clientFormInitialValues'
import { AddressDialog } from '../AddressDialog/AddressDialog'
import useStyles from './PassportArea.styles'

export function PassportArea() {
  const classes = useStyles()

  const { values, setFieldValue } = useFormikContext<ClientData>()
  const { hasNameChanged, regAddrIsLivingAddr } = values
  const { registrationAddress, registrationAddressString, livingAddress, livingAddressString } = values
  const [isRegAddressDialogVisible, setIsRegAddressDialogVisible] = useState(false)
  const [isLivingAddressDialogVisible, setIsLivingAddressDialogVisible] = useState(false)

  const onCloseAddressDialog = useCallback(
    (name: string, addressString: string) => {
      if (addressString === '') {
        setFieldValue(name, false)
      }
    },
    [setFieldValue],
  )

  const handleKladrChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.id === 'regNotKladr') {
        if (event.target.checked) {
          setIsRegAddressDialogVisible(true)
        } else {
          setFieldValue('registrationAddress', configAddressInitialValues)
          setFieldValue('registrationAddressString', '')
        }
      }
      if (event.target.id === 'livingNotKladr') {
        if (event.target.checked) {
          setIsLivingAddressDialogVisible(true)
        } else {
          setFieldValue('livingAddress', configAddressInitialValues)
          setFieldValue('livingAddressString', '')
        }
      }
    },
    [setIsRegAddressDialogVisible, setIsLivingAddressDialogVisible, setFieldValue],
  )

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
        disabled
      />
      <SwitchInputFormik name="hasNameChanged" label="Менялось" gridColumn="span 4" centered />

      <MaskedInputFormik
        name="passport"
        label="Серия и номер паспорта"
        placeholder="-"
        mask={maskPassport}
        gridColumn="span 4"
        disabled
      />
      <DateInputFormik name="birthDate" label="День рождения" gridColumn="span 4" disabled />
      <Box gridColumn="span 8" />

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
        gridColumn="span 3"
      />
      <SelectInputFormik
        name="familyStatus"
        label="Семейное положение"
        placeholder="-"
        options={['Женат', 'Не женат']}
        gridColumn="span 6"
      />
      <Box gridColumn="span 7" />

      <MaskedInputFormik
        name="birthPlace"
        label="Место рождения"
        placeholder="-"
        mask={maskNoRestrictions}
        gridColumn="span 6"
      />
      <DateInputFormik name="passportDate" label="Дата выдачи" gridColumn="span 3" />
      <MaskedInputFormik
        name="divisionCode"
        label="Код подразделения"
        placeholder="-"
        mask={maskDivisionCode}
        gridColumn="span 3"
      />
      <Box gridColumn="span 4" />

      <MaskedInputFormik
        name="issuedBy"
        label="Кем выдан"
        placeholder="-"
        mask={maskCyrillicAndDigits}
        gridColumn="span 12"
      />

      <MaskedInputFormik
        name="registrationAddressString"
        label="Адрес по регистрации (КЛАДР)"
        placeholder="-"
        mask={maskNoRestrictions}
        gridColumn="span 12"
        InputProps={{ readOnly: true }}
      />
      <SwitchInputFormik
        name="regNotKladr"
        label="Не КЛАДР"
        gridColumn="span 4"
        centered
        afterChange={handleKladrChange}
      />
      <AddressDialog
        addressName="registrationAddress"
        address={registrationAddress}
        label="Адрес по регистрации (КЛАДР)"
        isVisible={isRegAddressDialogVisible}
        setIsVisible={setIsRegAddressDialogVisible}
        onCloseDialog={() => onCloseAddressDialog('regNotKladr', registrationAddressString)}
      />

      <SwitchInputFormik
        name="regAddrIsLivingAddr"
        label="Адрес проживания совпадает с адресом регистрации"
        gridColumn="span 16"
      />
      {!regAddrIsLivingAddr && (
        <MaskedInputFormik
          name="livingAddressString"
          label="Адрес проживания"
          placeholder="-"
          mask={maskNoRestrictions}
          gridColumn="span 12"
          InputProps={{ readOnly: true }}
        />
      )}
      {!regAddrIsLivingAddr && (
        <SwitchInputFormik
          name="livingNotKladr"
          label="Не КЛАДР"
          gridColumn="span 4"
          centered
          afterChange={handleKladrChange}
        />
      )}
      <AddressDialog
        addressName="livingAddress"
        address={livingAddress}
        label="Адрес проживания (КЛАДР)"
        isVisible={isLivingAddressDialogVisible}
        setIsVisible={setIsLivingAddressDialogVisible}
        onCloseDialog={() => onCloseAddressDialog('livingNotKladr', livingAddressString)}
      />
    </Box>
  )
}
