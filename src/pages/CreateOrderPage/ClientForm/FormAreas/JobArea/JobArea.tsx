import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { Box, Typography } from '@mui/material'
import {
  AddressGetOrganizationSuggestions,
  SuggestionGetAddressSuggestions,
  SuggestionGetOrganizationSuggestions,
} from '@sberauto/dadata-proto/public'
import { useFormikContext } from 'formik'
import throttle from 'lodash/throttle'

import { useGetOrganizationSuggestions } from 'shared/api/requests/dadata.api'
import { maskInn, maskNoRestrictions, maskPhoneNumber } from 'shared/masks/InputMasks'
import { AutocompleteDaDataAddressFormik } from 'shared/ui/AutocompleteInput/AutocompleteDaDataAddressFormik'
import { AutocompleteInputFormik } from 'shared/ui/AutocompleteInput/AutocompleteInputFormik'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import { ClientData } from '../../ClientForm.types'
import { configAddressInitialValues, OCCUPATION_VALUES } from '../../config/clientFormInitialValues'
import { JOB_DISABLED_OCCUPATIONS } from '../../config/clientFormValidation'
import { AddressDialog } from '../AddressDialog/AddressDialog'
import useStyles from './JobArea.styles'

export const DADATA_EMPLOYER_OPTIONS_LIMIT = 20

export function JobArea() {
  const classes = useStyles()
  const [jobDisabled, setJobDisabled] = useState(false)
  const { values, setFieldValue } = useFormikContext<ClientData>()
  const { employerName } = values
  const [isEmplAddressDialogVisible, setIsEmplAddressDialogVisible] = useState(false)
  const { occupation, employerAddress, employerAddressString, emplNotKladr } = values

  const { mutate: fetchOrganizationSuggestions, data } = useGetOrganizationSuggestions()
  const [addressSuggestion, setAddressSuggestion] = useState<AddressGetOrganizationSuggestions>()

  const { options: employerNameSuggestions, optionsMap: employerNameSuggestionsMap } = useMemo(
    () =>
      [...(data?.suggestions ?? [])].reduce(
        (acc, option, i, arr) => {
          if (option.value && option.data?.inn) {
            const val = `${option.value} ${option.data?.inn}`
            acc.options.push(val)
            acc.optionsMap[val] = option
          }
          if (acc.options.length === DADATA_EMPLOYER_OPTIONS_LIMIT) {
            arr.splice(1)
          }

          return acc
        },
        { options: [] as string[], optionsMap: {} as Record<string, SuggestionGetOrganizationSuggestions> },
      ),
    [data?.suggestions],
  )

  const handleEmployerNameSelect = useCallback(
    (value: string | string[] | null) => {
      if (typeof value !== 'string') {
        return
      }
      const currentEmployerNameSuggestion = employerNameSuggestionsMap[value || '']
      if (currentEmployerNameSuggestion) {
        setFieldValue('employerInn', currentEmployerNameSuggestion.data?.inn)
        setFieldValue('employerPhone', currentEmployerNameSuggestion.data?.phones)
        if (currentEmployerNameSuggestion.data?.address) {
          setAddressSuggestion(currentEmployerNameSuggestion.data?.address)
        }
      }
    },
    [employerNameSuggestionsMap, setFieldValue],
  )

  const updateListOfSuggestions = useMemo(
    () =>
      throttle((value: string) => {
        fetchOrganizationSuggestions(value)
      }, 1000),
    [fetchOrganizationSuggestions],
  )

  useEffect(() => {
    if (employerName && employerName.length > 2) {
      updateListOfSuggestions(employerName)
    }
  }, [employerName, updateListOfSuggestions])

  useEffect(() => {
    if (occupation !== null && JOB_DISABLED_OCCUPATIONS.includes(occupation)) {
      setJobDisabled(true)
      setFieldValue('employmentDate', '')
      setFieldValue('employerName', '')
      setFieldValue('employerPhone', '')
      setFieldValue('employerAddress', configAddressInitialValues)
      setAddressSuggestion({})
      setFieldValue('employerAddressString', '')
      setFieldValue('emplNotKladr', false)
      setFieldValue('employerInn', '')
    } else {
      setJobDisabled(false)
    }
  }, [occupation, setFieldValue, setJobDisabled])

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
      }
      setFieldValue('employerAddress', configAddressInitialValues)
      setFieldValue('employerAddressString', '')
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
        options={OCCUPATION_VALUES}
        gridColumn="span 8"
      />
      <DateInputFormik
        name="employmentDate"
        label="Дата устройства на работу"
        gridColumn="span 4"
        disabled={jobDisabled}
      />
      <AutocompleteInputFormik
        name="employerName"
        label="Наименование организации"
        placeholder="-"
        options={employerNameSuggestions}
        isCustomValueAllowed
        mask={maskNoRestrictions}
        gridColumn="span 12"
        disabled={jobDisabled}
        onSelectOption={handleEmployerNameSelect}
      />
      <Box gridColumn="span 4" />

      <MaskedInputFormik
        name="employerInn"
        label="ИНН организации"
        placeholder="-"
        mask={maskInn}
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

      {emplNotKladr ? (
        <MaskedInputFormik
          name="employerAddressString"
          label="Адрес работодателя (КЛАДР)"
          placeholder="-"
          mask={maskNoRestrictions}
          gridColumn="span 12"
          disabled={jobDisabled}
          InputProps={{ readOnly: true }}
        />
      ) : (
        <AutocompleteDaDataAddressFormik
          nameOfString="employerAddressString"
          nameOfObject="employerAddress"
          label="Адрес работодателя (КЛАДР)"
          placeholder="-"
          gridColumn="span 12"
          disabled={jobDisabled}
          forceValue={addressSuggestion as SuggestionGetAddressSuggestions}
        />
      )}

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
