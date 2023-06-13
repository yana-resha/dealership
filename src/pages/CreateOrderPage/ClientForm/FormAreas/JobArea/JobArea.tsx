import React, { useCallback, useEffect, useState } from 'react'

import { Box, Typography } from '@mui/material'
import { useFormikContext } from 'formik'

import { Occupation } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import { maskDigitsOnly, maskNoRestrictions, maskPhoneNumber } from 'shared/masks/InputMasks'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import { ClientData } from '../../ClientForm.types'
import { OCCUPATION_VALUES, configAddressInitialValues } from '../../config/clientFormInitialValues'
import { AddressDialog } from '../AddressDialog/AddressDialog'
import useStyles from './JobArea.styles'

export function JobArea() {
  const classes = useStyles()
  const [jobDisabled, setJobDisabled] = useState(false)
  const { values, setFieldValue } = useFormikContext<ClientData>()
  const [isEmplAddressDialogVisible, setIsEmplAddressDialogVisible] = useState(false)
  const { occupation, employerAddress, employerAddressString } = values

  useEffect(() => {
    if (occupation === Occupation.WithoutWork) {
      setJobDisabled(true)
      setFieldValue('employmentDate', '')
      setFieldValue('employerName', '')
      setFieldValue('employerPhone', '')
      setFieldValue('employerAddress', configAddressInitialValues)
      setFieldValue('employerAddressString', '')
      setFieldValue('emplNotKladr', false)
      setFieldValue('employerInn', '')
    } else {
      setJobDisabled(false)
    }
  }, [occupation, setFieldValue, setJobDisabled])

  useEffect(() => {})

  const onCloseAddressDialog = useCallback(
    (addressString: string) => {
      if (addressString === '') {
        setFieldValue('emplNotKladr', false)
      }
    },
    [setFieldValue],
  )

  const handleKladrChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setIsEmplAddressDialogVisible(true)
      } else {
        setFieldValue('employerAddress', configAddressInitialValues)
        setFieldValue('employerAddressString', '')
      }
    },
    [setIsEmplAddressDialogVisible, setFieldValue],
  )

  return (
    <Box className={classes.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={classes.areaLabel}>Работа</Typography>
      </Box>

      <SelectInputFormik
        name="occupation"
        label="Должность/Вид занятости"
        placeholder="-"
        //TODO нужен enum в контракте DCB-390
        options={OCCUPATION_VALUES}
        gridColumn="span 8"
      />
      <DateInputFormik
        name="employmentDate"
        label="Дата устройства на работу"
        gridColumn="span 4"
        disabled={jobDisabled}
      />

      <MaskedInputFormik
        name="employerName"
        label="Наименование организации"
        placeholder="-"
        mask={maskNoRestrictions}
        gridColumn="span 12"
        disabled={jobDisabled}
      />
      <Box gridColumn="span 4" />

      <MaskedInputFormik
        name="employerInn"
        label="ИНН организации"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 5"
        disabled={jobDisabled}
      />
      <MaskedInputFormik
        name="employerPhone"
        label="Телефон"
        placeholder="-"
        mask={maskPhoneNumber}
        gridColumn="span 5"
        disabled={jobDisabled}
      />

      <MaskedInputFormik
        name="employerAddressString"
        label="Адрес работодателя (КЛАДР)"
        placeholder="-"
        mask={maskNoRestrictions}
        gridColumn="span 12"
        disabled={jobDisabled}
        InputProps={{ readOnly: true }}
      />
      <SwitchInputFormik
        name="emplNotKladr"
        label="Не КЛАДР"
        gridColumn="span 4"
        centered
        disabled={jobDisabled}
        afterChange={handleKladrChange}
      />
      <AddressDialog
        addressName="employerAddress"
        address={employerAddress}
        label="Адрес работодателя (КЛАДР)"
        isVisible={isEmplAddressDialogVisible}
        setIsVisible={setIsEmplAddressDialogVisible}
        onCloseDialog={() => onCloseAddressDialog(employerAddressString)}
      />
    </Box>
  )
}
