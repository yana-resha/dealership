import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Box } from '@mui/material'
import { OptionID } from '@sberauto/dictionarydc-proto/public'
import { ArrayHelpers, useFormikContext } from 'formik'

import { FULL_INITIAL_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import { FullInitialAdditionalService, FullOrderCalculatorFields } from 'common/OrderCalculator/types'
import {
  maskBankAccountNumber,
  maskBankIdentificationCode,
  maskNoRestrictions,
  maskOnlyDigitsWithSeparator,
} from 'shared/masks/InputMasks'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { RadioGroupInput } from 'shared/ui/RadioGroupInput/RadioGroupInput'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { AddingSquareBtn } from 'shared/ui/SquareBtn/AddingSquareBtn'
import { CloseSquareBtn } from 'shared/ui/SquareBtn/CloseSquareBtn'
import { SwitchInput } from 'shared/ui/SwitchInput/SwitchInput'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import { DOCUMENT_TYPES } from '../../configs/clientDetailedDossier.config'
import { useAdditionalServices } from '../../hooks/useAdditionalServices'
import { ServicesGroupName, useAdditionalServicesOptions } from '../../hooks/useAdditionalServicesOptions'
import { PreparedAdditionalOptionForFinancingMap } from '../../hooks/useRequisitesForFinancingQuery'
import { useStyles } from './DealerServicesRequisites.styles'

type Props = {
  optionRequisite: PreparedAdditionalOptionForFinancingMap | undefined
  index: number
  parentName: ServicesGroupName
  isNecessaryCasco?: boolean
  isRequisiteEditable: boolean
  productOptions?: {
    value: string | number
    label: string
  }[]
  arrayHelpers?: ArrayHelpers
  arrayLength?: number
  servicesItem: FullInitialAdditionalService
  changeIds?: (idx: number, changingOption: string, minItems?: number) => void
}

const terms = [
  { value: '12' },
  { value: '24' },
  { value: '36' },
  { value: '48' },
  { value: '60' },
  { value: '72' },
]

export function DealerServicesRequisites({
  optionRequisite,
  index,
  parentName,
  isNecessaryCasco = false,
  isRequisiteEditable,
  arrayHelpers,
  arrayLength,
  servicesItem,
  changeIds,
  productOptions,
}: Props) {
  const classes = useStyles()
  const { values, setFieldValue } = useFormikContext<FullOrderCalculatorFields>()
  const { provider, agent, beneficiaryBank, taxPresence, productCost, productType } = servicesItem
  const [isManualEntry, setManualEntry] = useState(false)
  const initialValues = useRef(servicesItem)
  const { namePrefix, removeItem, addItem } = useAdditionalServices({
    parentName,
    index,
    arrayLength,
    arrayHelpers,
    changeIds,
    initialValues: FULL_INITIAL_ADDITIONAL_SERVICE,
  })

  const { filteredOptions, shouldDisableAdding } = useAdditionalServicesOptions({
    values,
    index,
    parentName,
    options: productOptions,
  })

  const vendorOptions = useMemo(
    () =>
      (optionRequisite?.vendorsWithBroker || []).map(v => ({
        value: v.vendorCode,
        label: v.vendorName,
      })),
    [optionRequisite?.vendorsWithBroker],
  )
  const currentVendor = useMemo(
    () => optionRequisite?.vendorsWithBrokerMap[provider],
    [provider, optionRequisite?.vendorsWithBrokerMap],
  )

  const brokerOptions = useMemo(
    () =>
      (currentVendor?.brokers || []).map(v => ({
        value: v.brokerCode,
        label: v.brokerName,
      })),
    [currentVendor?.brokers],
  )
  const currentBroker = useMemo(() => currentVendor?.brokersMap[agent], [agent, currentVendor?.brokersMap])

  const banksOptions = useMemo(
    () =>
      (currentBroker?.requisites || []).map(r => ({
        value: r.bankName,
      })),
    [currentBroker?.requisites],
  )
  const currentBank = useMemo(
    () => currentBroker?.requisitesMap[beneficiaryBank],
    [beneficiaryBank, currentBroker?.requisitesMap],
  )

  const accountNumberOptions = useMemo(
    () => (currentBank?.accounts || []).map(a => ({ value: a })),
    [currentBank?.accounts],
  )

  const resetInitialValues = useCallback(() => {
    setFieldValue(`${namePrefix}beneficiaryBank`, '')
    setFieldValue(`${namePrefix}taxPresence`, initialValues.current.taxPresence)
    setFieldValue(`${namePrefix}taxation`, initialValues.current.taxation)
  }, [namePrefix, setFieldValue])

  const clearFieldsForManualEntry = useCallback(() => {
    setFieldValue(`${namePrefix}beneficiaryBank`, '')
    setFieldValue(`${namePrefix}bankAccountNumber`, '')
    setFieldValue(`${namePrefix}bankIdentificationCode`, '')
    setFieldValue(`${namePrefix}correspondentAccount`, '')
    setFieldValue(`${namePrefix}taxPresence`, false)
    setFieldValue(`${namePrefix}taxation`, '0')
  }, [namePrefix, setFieldValue])

  const handleManualEntryChange = useCallback(
    (manual: boolean) => {
      if (manual) {
        clearFieldsForManualEntry()
        setManualEntry(true)
      } else {
        setManualEntry(false)
        resetInitialValues()
      }
    },
    [clearFieldsForManualEntry, resetInitialValues, setManualEntry],
  )

  const toggleTaxInPercentField = useCallback(
    (value: boolean) => {
      setFieldValue(`${namePrefix}taxPresence`, value)
      setFieldValue(`${namePrefix}taxation`, value ? '' : '0')
    },
    [namePrefix, setFieldValue],
  )

  useEffect(() => {
    if (!isManualEntry) {
      setFieldValue(namePrefix + 'provider', currentVendor?.vendorCode ? currentVendor?.vendorCode : '')
    }
  }, [currentVendor?.vendorCode, isManualEntry, namePrefix, setFieldValue])

  useEffect(() => {
    if (!isManualEntry) {
      setFieldValue(
        namePrefix + 'beneficiaryBank',
        currentBroker?.requisites.length === 1 ? currentBroker.requisites[0].bankName : '',
      )
    }
  }, [currentBroker?.requisites, isManualEntry, namePrefix, setFieldValue])

  useEffect(() => {
    if (!isManualEntry) {
      setFieldValue(namePrefix + 'bankIdentificationCode', currentBank?.bik || '')
      setFieldValue(namePrefix + 'correspondentAccount', currentBank?.accountCorrNumber || '')
      setFieldValue(
        namePrefix + 'bankAccountNumber',
        currentBank?.accounts?.length === 1 ? currentBank.accounts[0] : '',
      )
    }
  }, [
    currentBank?.accountCorrNumber,
    currentBank?.accounts,
    currentBank?.bik,
    isManualEntry,
    namePrefix,
    setFieldValue,
  ])

  useEffect(() => {
    if (currentVendor?.tax) {
      setFieldValue(namePrefix + 'providerTaxPercent', currentVendor.tax)
      setFieldValue(namePrefix + 'providerTaxValue', currentVendor.tax * parseInt(productCost || '0', 10))
    } else {
      setFieldValue(namePrefix + 'providerTaxPercent', null)
      setFieldValue(namePrefix + 'providerTaxValue', null)
    }

    if (currentBroker?.tax) {
      setFieldValue(namePrefix + 'agentTaxPercent', currentBroker.tax)
      setFieldValue(namePrefix + 'agentTaxValue', currentBroker.tax * parseInt(productCost || '0', 10))
    } else {
      setFieldValue(namePrefix + 'agentTaxPercent', null)
      setFieldValue(namePrefix + 'agentTaxValue', null)
    }
  }, [currentBroker?.tax, currentVendor?.tax, namePrefix, productCost, setFieldValue])

  const isShouldShowCascoLimitField =
    isNecessaryCasco &&
    parentName === ServicesGroupName.dealerAdditionalServices &&
    productType === OptionID.CASCO

  return (
    <Box className={classes.editingAreaContainer}>
      {isRequisiteEditable && productOptions ? (
        <SelectInputFormik
          name={`${namePrefix}productType`}
          label="Тип продукта"
          placeholder="-"
          options={filteredOptions}
          gridColumn="span 6"
        />
      ) : (
        <MaskedInputFormik
          name={`${namePrefix}productType`}
          label="Тип продукта"
          placeholder="-"
          mask={maskNoRestrictions}
          gridColumn="span 6"
          disabled
        />
      )}
      <SelectInputFormik
        name={`${namePrefix}provider`}
        label="Страховая компания или поставщик"
        placeholder="-"
        options={vendorOptions}
        gridColumn="span 6"
      />
      <SwitchInputFormik
        name={`${namePrefix}isCredit`}
        label="В кредит"
        gridColumn="span 2"
        centered
        disabled={!isRequisiteEditable}
      />
      {isRequisiteEditable && (
        <Box className={classes.btnContainer} gridColumn="span 1">
          <CloseSquareBtn onClick={removeItem} />
          <AddingSquareBtn onClick={addItem} disabled={shouldDisableAdding} />
        </Box>
      )}
      <SelectInputFormik
        name={`${namePrefix}agent`}
        label="Агент получатель"
        placeholder="-"
        options={brokerOptions}
        gridColumn="span 6"
        disabled={!brokerOptions.length}
      />
      <SelectInputFormik
        name={`${namePrefix}loanTerm`}
        label="Срок"
        placeholder="-"
        options={terms}
        gridColumn="span 3"
      />
      <MaskedInputFormik
        name={`${namePrefix}productCost`}
        label="Стоимость"
        placeholder="-"
        mask={maskOnlyDigitsWithSeparator}
        gridColumn="span 3"
        disabled={!isRequisiteEditable}
      />
      {isShouldShowCascoLimitField && (
        <MaskedInputFormik
          name={`${namePrefix}cascoLimit`}
          label="Сумма покрытия КАСКО"
          placeholder="-"
          mask={maskOnlyDigitsWithSeparator}
          gridColumn="span 3"
          disabled={!isRequisiteEditable}
        />
      )}

      <SelectInputFormik
        name={`${namePrefix}documentType`}
        label="Тип документа"
        placeholder="-"
        options={DOCUMENT_TYPES}
        gridColumn="span 4"
      />
      <MaskedInputFormik
        name={`${namePrefix}documentNumber`}
        label="Номер документа"
        placeholder="-"
        mask={maskNoRestrictions}
        gridColumn="span 4"
      />
      <DateInputFormik name={`${namePrefix}documentDate`} label="Дата документа" gridColumn="span 4" />
      {isManualEntry ? (
        <>
          <MaskedInputFormik
            name={`${namePrefix}bankIdentificationCode`}
            label="БИК"
            placeholder="-"
            mask={maskBankIdentificationCode}
            gridColumn="span 3"
          />
          <MaskedInputFormik
            name={`${namePrefix}beneficiaryBank`}
            label="Банк получатель денежных средств"
            placeholder="-"
            mask={maskNoRestrictions}
            gridColumn="span 5"
          />
          <MaskedInputFormik
            name={`${namePrefix}bankAccountNumber`}
            label="Расчетный счет"
            placeholder="-"
            mask={maskBankAccountNumber}
            gridColumn="span 4"
          />
        </>
      ) : (
        <>
          <SelectInputFormik
            name={`${namePrefix}beneficiaryBank`}
            label="Банк получатель денежных средств"
            placeholder="-"
            options={banksOptions}
            gridColumn="span 6"
            disabled={!banksOptions.length}
          />
          <SelectInputFormik
            name={`${namePrefix}bankAccountNumber`}
            label="Расчетный счет"
            placeholder="-"
            options={accountNumberOptions}
            gridColumn="span 6"
            disabled={!accountNumberOptions.length}
          />
        </>
      )}
      <Box gridColumn="span 3" width="auto" minWidth="min-content">
        <SwitchInput
          value={isManualEntry}
          label="Ввести вручную"
          onChange={handleManualEntryChange}
          centered
          disabled
        />
      </Box>
      {isManualEntry && (
        <>
          <MaskedInputFormik
            name={`${namePrefix}correspondentAccount`}
            label="Корреспондентский счёт"
            placeholder="-"
            mask={maskBankAccountNumber}
            gridColumn="span 5"
          />
          <Box display="flex" justifyContent="center" minWidth="max-content" gridColumn="span 3">
            <RadioGroupInput
              radioValues={[
                { radioValue: false, radioLabel: 'Без НДС' },
                { radioValue: true, radioLabel: 'С НДС' },
              ]}
              defaultValue={false}
              onChange={toggleTaxInPercentField}
              centered
            />
          </Box>
          <MaskedInputFormik
            name={`${namePrefix}taxation`}
            label="Налог"
            placeholder="-"
            mask={maskOnlyDigitsWithSeparator}
            gridColumn="span 4"
            disabled={!taxPresence}
          />
        </>
      )}
    </Box>
  )
}
