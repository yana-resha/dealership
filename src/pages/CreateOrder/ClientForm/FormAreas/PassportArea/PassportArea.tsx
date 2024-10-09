import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Box, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import throttle from 'lodash/throttle'
import { Timeout } from 'react-number-format/types/types'

import { selectCurrentGovernmentProgram } from 'entities/order'
import { DADATA_OPTIONS_LIMIT, useGetFmsUnitSuggestions } from 'shared/api/requests/dadata.api'
import { FieldLabels } from 'shared/constants/fieldLabels'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { usePrevious } from 'shared/hooks/usePrevious'
import {
  maskDivisionCode,
  maskNoRestrictions,
  maskPassport,
  maskCyrillicAndDigits,
  maskName,
} from 'shared/masks/InputMasks'
import { AutocompleteDaDataAddressFormik } from 'shared/ui/AutocompleteInput/AutocompleteDaDataAddressFormik'
import { AutocompleteInputFormik } from 'shared/ui/AutocompleteInput/AutocompleteInputFormik'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInput } from 'shared/ui/MaskedInput/MaskedInput'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'
import { stringToNumber } from 'shared/utils/stringToNumber'

import { ClientData } from '../../ClientForm.types'
import {
  FAMILY_STATUS_VALUES,
  SEX_VALUES,
  configAddressInitialValues,
} from '../../config/clientFormInitialValues'
import { usePrepareAddress } from '../../hooks/usePrepareAddress'
import { getChildrenCount } from '../../utils/getChildrenCount'
import { AddressDialog } from '../AddressDialog/AddressDialog'
import useStyles from './PassportArea.styles'

export function PassportArea() {
  const classes = useStyles()
  const { prepareAddress } = usePrepareAddress()
  const currentGovernmentProgram = useAppSelector(selectCurrentGovernmentProgram)

  const { values, setFieldValue } = useFormikContext<ClientData>()
  const {
    clientLastName,
    clientFirstName,
    clientMiddleName,
    registrationAddress,
    registrationAddressString,
    livingAddress,
    livingAddressString,
    hasNameChanged,
    divisionCode,
    regAddrIsLivingAddr,
    regNotKladr,
    livingNotKladr,
    numOfChildren,
    validationParams,
  } = values
  const previousDivisionCode = usePrevious(divisionCode)
  const [isRegAddressDialogVisible, setIsRegAddressDialogVisible] = useState(false)
  const [isLivingAddressDialogVisible, setIsLivingAddressDialogVisible] = useState(false)
  const { mutate: getPassportSuggestions, data } = useGetFmsUnitSuggestions()
  const [issuedBySuggestions, setIssuedBySuggestions] = useState<string[]>([])
  const [divisionCodeSuggestions, setDivisionCodeSuggestions] = useState<string[]>([])
  const timerRef = useRef<Timeout | null>(null)
  const childrenCounts = useMemo(() => {
    const children = stringToNumber(currentGovernmentProgram?.children) || 0

    return getChildrenCount(numOfChildren !== null && children && numOfChildren >= children ? children : 0)
  }, [currentGovernmentProgram?.children, numOfChildren])

  const updateListOfSuggestions = useMemo(
    () =>
      throttle((value: string) => {
        getPassportSuggestions(value)
      }, 1000),
    [getPassportSuggestions],
  )

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
        }
        setFieldValue('registrationAddress', configAddressInitialValues)
        setFieldValue('registrationAddressString', '')
      }
      if (event.target.id === 'livingNotKladr') {
        if (event.target.checked) {
          setIsLivingAddressDialogVisible(true)
        }
        setFieldValue('livingAddress', configAddressInitialValues)
        setFieldValue('livingAddressString', '')
      }
    },
    [setIsRegAddressDialogVisible, setIsLivingAddressDialogVisible, setFieldValue],
  )

  const handlePrevNameSwitchChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      if (!evt.target.checked) {
        setFieldValue('clientFormerLastName', '')
        setFieldValue('clientFormerFirstName', '')
        setFieldValue('clientFormerMiddleName', '')
      }
    },
    [setFieldValue],
  )

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (
      divisionCode === null ||
      (divisionCode && divisionCode.length < 6) ||
      (divisionCode !== previousDivisionCode && previousDivisionCode !== '')
    ) {
      setIssuedBySuggestions([])
      setFieldValue('issuedBy', '')
      if (divisionCode === null) {
        return
      }
    }
    updateListOfSuggestions(divisionCode)
  }, [divisionCode, previousDivisionCode, setFieldValue, updateListOfSuggestions])

  useEffect(() => {
    const suggestionsForDivisionCode =
      data?.suggestions?.reduce((acc: string[], option) => {
        if (option.data?.code && !acc.includes(option.data.code)) {
          acc.push(option.data.code)
        }

        return acc.length > DADATA_OPTIONS_LIMIT ? acc.slice(0, DADATA_OPTIONS_LIMIT) : acc
      }, []) ?? []
    setDivisionCodeSuggestions(suggestionsForDivisionCode)

    if (divisionCode.length === 6) {
      const suggestionsForIssuedBy =
        data?.suggestions?.reduce((acc: string[], option) => {
          if (option.unrestrictedValue && !acc.includes(option.unrestrictedValue)) {
            acc.push(option.unrestrictedValue)
          }

          return acc.length > DADATA_OPTIONS_LIMIT ? acc.slice(0, DADATA_OPTIONS_LIMIT) : acc
        }, []) ?? []
      setIssuedBySuggestions(suggestionsForIssuedBy)
      if (suggestionsForIssuedBy.length === 1) {
        setFieldValue('issuedBy', suggestionsForIssuedBy[0])
      }
    }
  }, [data?.suggestions, divisionCode.length, setFieldValue])

  return (
    <Box className={classes.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={classes.areaLabel}>Паспортные данные</Typography>
      </Box>

      <Box width="auto" gridColumn="span 12">
        <MaskedInput
          label="ФИО"
          mask={maskNoRestrictions}
          value={`${clientLastName} ${clientFirstName} ${clientMiddleName}`}
          disabled
        />
      </Box>

      <SwitchInputFormik
        name="hasNameChanged"
        label="Менялось"
        gridColumn="span 4"
        centered
        onChange={handlePrevNameSwitchChange}
      />

      {hasNameChanged && (
        <>
          <MaskedInputFormik
            name="clientFormerLastName"
            label="Фамилия до смены"
            placeholder="Фамилия до смены"
            mask={maskName}
            gridColumn="span 4"
          />
          <MaskedInputFormik
            name="clientFormerFirstName"
            label="Имя до смены"
            placeholder="Имя до смены"
            mask={maskName}
            gridColumn="span 4"
          />
          <MaskedInputFormik
            name="clientFormerMiddleName"
            label="Отчество до смены"
            placeholder="Отчество до смены"
            mask={maskName}
            gridColumn="span 4"
          />
        </>
      )}
      {hasNameChanged && <Box gridColumn="span 4" />}

      <SelectInputFormik name="sex" label="Пол" placeholder="-" options={SEX_VALUES} gridColumn="span 3" />
      <DateInputFormik name="birthDate" label="Дата рождения" gridColumn="span 3" disabled />
      <MaskedInputFormik
        name="birthPlace"
        label="Место рождения"
        placeholder="-"
        mask={maskCyrillicAndDigits}
        gridColumn="span 6"
      />
      <Box gridColumn="span 4" />

      <DateInputFormik name="passportDate" label="Дата выдачи" gridColumn="span 4" />
      <AutocompleteInputFormik
        name="divisionCode"
        label="Код подразделения"
        placeholder="-"
        options={divisionCodeSuggestions}
        isCustomValueAllowed
        mask={maskDivisionCode}
        gridColumn="span 4"
      />
      <MaskedInputFormik
        name="passport"
        label="Серия и номер паспорта"
        placeholder="-"
        mask={maskPassport}
        gridColumn="span 4"
        disabled
      />
      <Box gridColumn="span 4" />

      <AutocompleteInputFormik
        name="issuedBy"
        label="Кем выдан"
        placeholder="-"
        options={issuedBySuggestions}
        isCustomValueAllowed
        mask={maskCyrillicAndDigits}
        gridColumn="span 12"
      />
      <Box gridColumn="span 4" />

      <SelectInputFormik
        name="numOfChildren"
        label="Количество детей"
        placeholder="-"
        options={childrenCounts}
        gridColumn="span 3"
      />
      <SelectInputFormik
        name="familyStatus"
        label="Семейное положение"
        placeholder="-"
        options={FAMILY_STATUS_VALUES}
        gridColumn="span 5"
      />
      <Box gridColumn="span 7" />
      {regNotKladr ? (
        <MaskedInputFormik
          name="registrationAddressString"
          label="Адрес по регистрации (КЛАДР)"
          placeholder="-"
          mask={maskNoRestrictions}
          gridColumn="span 12"
          InputProps={{ readOnly: true }}
        />
      ) : (
        <AutocompleteDaDataAddressFormik
          nameOfString="registrationAddressString"
          nameOfObject="registrationAddress"
          label="Адрес по регистрации (КЛАДР)"
          placeholder="-"
          gridColumn="span 12"
          prepareAddress={prepareAddress}
        />
      )}

      <SwitchInputFormik
        name="regNotKladr"
        label={FieldLabels.MANUAL_ENTRY}
        gridColumn="span 4"
        centered
        onChange={handleKladrChange}
      />
      <AddressDialog
        addressName="registrationAddress"
        address={registrationAddress}
        label="Адрес по регистрации (КЛАДР)"
        isVisible={isRegAddressDialogVisible}
        isDfoOnly={validationParams.isDfoProgram}
        setIsVisible={setIsRegAddressDialogVisible}
        onCloseDialog={() => onCloseAddressDialog('regNotKladr', registrationAddressString)}
      />

      <SwitchInputFormik
        name="regAddrIsLivingAddr"
        label="Адрес проживания совпадает с адресом регистрации"
        gridColumn="span 16"
      />
      {!regAddrIsLivingAddr && (
        <>
          {livingNotKladr ? (
            <MaskedInputFormik
              name="livingAddressString"
              label="Адрес проживания"
              placeholder="-"
              mask={maskNoRestrictions}
              gridColumn="span 12"
              InputProps={{ readOnly: true }}
            />
          ) : (
            <AutocompleteDaDataAddressFormik
              nameOfString="livingAddressString"
              nameOfObject="livingAddress"
              label="Адрес проживания (КЛАДР)"
              placeholder="-"
              gridColumn="span 12"
              prepareAddress={prepareAddress}
            />
          )}
        </>
      )}
      {!regAddrIsLivingAddr && (
        <SwitchInputFormik
          name="livingNotKladr"
          label={FieldLabels.MANUAL_ENTRY}
          gridColumn="span 4"
          centered
          onChange={handleKladrChange}
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
