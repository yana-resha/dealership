import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Box, Collapse, Typography } from '@mui/material'
import {
  AddressGetOrganizationSuggestions,
  SuggestionGetAddressSuggestions,
  SuggestionGetOrganizationSuggestions,
} from '@sberauto/dadata-proto/public'
import { OccupationType } from '@sberauto/loanapplifecycledc-proto/public'
import cx from 'classnames'
import { useFormikContext } from 'formik'
import throttle from 'lodash/throttle'

import { useGetOrganizationSuggestions } from 'shared/api/requests/dadata.api'
import { FieldLabels } from 'shared/constants/fieldLabels'
import { useOnScreen } from 'shared/hooks/useOnScreen'
import { maskInn, maskNoRestrictions, maskCommonPhoneNumber } from 'shared/masks/InputMasks'
import { AutocompleteDaDataAddressFormik } from 'shared/ui/AutocompleteInput/AutocompleteDaDataAddressFormik'
import { AutocompleteInputFormik } from 'shared/ui/AutocompleteInput/AutocompleteInputFormik'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import { ClientData } from '../../ClientForm.types'
import { configAddressInitialValues, OCCUPATION_VALUES } from '../../config/clientFormInitialValues'
import { JOB_DISABLED_OCCUPATIONS } from '../../config/clientFormValidation'
import { usePrepareAddress } from '../../hooks/usePrepareAddress'
import { AddressDialog } from '../AddressDialog/AddressDialog'
import useStyles from './JobArea.styles'

export const DADATA_EMPLOYER_OPTIONS_LIMIT = 20

export function JobArea() {
  const classes = useStyles()
  const { prepareAddress } = usePrepareAddress()
  const [jobDisabled, setJobDisabled] = useState(false)
  const [isEmplAddressDialogVisible, setIsEmplAddressDialogVisible] = useState(false)

  const { values, touched, setFieldValue, setFieldTouched } = useFormikContext<ClientData>()
  const {
    occupation,
    employerAddress,
    employerAddressString,
    emplNotKladr,
    employerName,
    isIncomeProofUploaderTouched,
  } = values

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

  const handleEmployerNameChange = useCallback(() => {
    !touched.employerName && setFieldTouched('employerName', true, true)
  }, [setFieldTouched, touched])

  const handleEmployerNameSelect = useCallback(
    (value: string | string[] | null) => {
      handleEmployerNameChange()
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
    [employerNameSuggestionsMap, handleEmployerNameChange, setFieldValue],
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

  // Блок работы со скролом поля occupation - прокручиваем до этого поля,
  // если оно незаполнено и пользователь пытается подтвердить доход.
  const [isWasScrolled, setWasScrolled] = useState(false)
  const jobAreaTitleRef = useRef<HTMLDivElement | undefined>()
  const isIntersecting = useOnScreen(jobAreaTitleRef)
  useEffect(() => {
    // Без isWasScrolled в условии scrollIntoView будет всегда срабатывать при прокрутке.
    if (!occupation && !isIntersecting && !isWasScrolled && isIncomeProofUploaderTouched) {
      jobAreaTitleRef.current?.scrollIntoView()
      // Потому запоминаем, что мы один раз уже прокурутили-показали поле occupation и больше не нужно.
      setWasScrolled(true)
    }
  }, [isIntersecting, occupation, isWasScrolled, isIncomeProofUploaderTouched])
  useEffect(() => {
    if (!isIncomeProofUploaderTouched) {
      // Сбрасываем значение isWasScrolled, чтобы в следующий раз снова  прокурутить-показать поле occupation
      setWasScrolled(false)
    }
  }, [isIntersecting, occupation, isWasScrolled, isIncomeProofUploaderTouched])
  //////

  useEffect(() => {
    switch (occupation) {
      case OccupationType.INDIVIDUAL_ENTREPRENEUR:
        setFieldValue('ndfl2File', null)
        break
      case OccupationType.WORKING_ON_A_TEMPORARY_CONTRACT:
      case OccupationType.WORKING_ON_A_PERMANENT_CONTRACT:
      case OccupationType.AGENT_ON_COMMISSION_CONTRACT:
      case OccupationType.CONTRACTOR_UNDER_CIVIL_LAW_CONTRACT:
        setFieldValue('ndfl3File', null)
        break
      case OccupationType.PRIVATE_PRACTICE:
      case OccupationType.PENSIONER:
      case OccupationType.UNEMPLOYED:
      case OccupationType.SELF_EMPLOYED:
        setFieldValue('ndfl3File', null)
        break
    }
  }, [occupation, setFieldValue])

  return (
    /* marginTop: '-20px' у родителя и  paddingTop: 20 у первого потомка необходимы,
    чтобы увеличить размер потомка, не увеличивая размер контейнера. Это необходимо,
    чтобы при автоскроле заголовок (первый контейнер) не уперался в верхнюю часть окна*/
    <Box>
      <Box className={classes.gridContainer} style={{ marginTop: '-20px' }}>
        <Box gridColumn="1 / -1" minWidth="min-content" ref={jobAreaTitleRef} style={{ paddingTop: 20 }}>
          <Typography className={classes.areaLabel}>Работа</Typography>
        </Box>

        <SelectInputFormik
          name="occupation"
          label="Должность/Вид занятости"
          placeholder="-"
          options={OCCUPATION_VALUES}
          gridColumn="span 8"
        />
        <Box gridColumn="span 4">
          <Collapse in={!jobDisabled}>
            <DateInputFormik name="employmentDate" label="Дата устройства на работу" disabled={jobDisabled} />
          </Collapse>
        </Box>
      </Box>
      <Collapse in={!jobDisabled}>
        <Box className={cx(classes.gridContainer, classes.collapsableGridContainer)}>
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
            onChange={handleEmployerNameChange}
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
            mask={maskCommonPhoneNumber}
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
              prepareAddress={prepareAddress}
            />
          )}

          <SwitchInputFormik
            name="emplNotKladr"
            label={FieldLabels.MANUAL_ENTRY}
            gridColumn="span 4"
            centered
            disabled={jobDisabled}
            onChange={handleKladrChange}
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
      </Collapse>
    </Box>
  )
}
