import { useCallback, useEffect, useMemo, useState } from 'react'

import { Box } from '@mui/material'
import { ArrayHelpers, useFormikContext } from 'formik'

import { FULL_INITIAL_ADDITIONAL_EQUIPMENTS } from 'common/OrderCalculator/config'
import { FullInitialAdditionalEquipments, FullOrderCalculatorFields } from 'common/OrderCalculator/types'
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

import { DOCUMENT_TYPES } from '../../configs/additionalOptionsRequisites.config'
import { useAdditionalServices } from '../../hooks/useAdditionalServices'
import { ServicesGroupName, useAdditionalServicesOptions } from '../../hooks/useAdditionalServicesOptions'
import { useRequisites } from '../../hooks/useRequisites'
import { useRequisitesContext } from '../RequisitesContext'
import { useStyles } from './AdditionalEquipmentRequisites.styles'

type Props = {
  index: number
  parentName: ServicesGroupName
  isRequisiteEditable: boolean
  productOptions?: {
    value: string | number
    label: string
  }[]
  arrayHelpers?: ArrayHelpers
  arrayLength?: number
  equipmentItem: FullInitialAdditionalEquipments
  changeIds?: (idx: number, changingOption: string, minItems?: number) => void
}

export function AdditionalEquipmentRequisites({
  index,
  parentName,
  isRequisiteEditable,
  arrayHelpers,
  arrayLength,
  equipmentItem,
  changeIds,
  productOptions,
}: Props) {
  const classes = useStyles()
  const { values, setFieldValue } = useFormikContext<FullOrderCalculatorFields>()
  const { legalPerson, beneficiaryBank, taxPresence, productCost } = equipmentItem
  const [isCustomFields, setCustomFields] = useState(false)

  const { requisites, isRequisitesFetched } = useRequisitesContext()

  const { namePrefix, removeItem, addItem } = useAdditionalServices({
    parentName,
    index,
    arrayLength,
    arrayHelpers,
    changeIds,
    initialValues: FULL_INITIAL_ADDITIONAL_EQUIPMENTS,
  })

  const { filteredOptions, shouldDisableAdding } = useAdditionalServicesOptions({
    values,
    index,
    parentName,
    options: productOptions,
  })

  const optionRequisite = useMemo(
    () => requisites?.additionalEquipmentsMap?.[equipmentItem.productType ?? ''],
    [equipmentItem.productType, requisites?.additionalEquipmentsMap],
  )

  const vendorOptions = useMemo(
    () =>
      (optionRequisite?.vendorsWithoutBroker || []).map(v => ({
        value: v.vendorCode,
        label: v.vendorName,
      })),
    [optionRequisite?.vendorsWithoutBroker],
  )
  const currentVendor = useMemo(
    () => optionRequisite?.vendorsWithoutBrokerMap[legalPerson],
    [legalPerson, optionRequisite?.vendorsWithoutBrokerMap],
  )

  const banksOptions = useMemo(
    () =>
      (currentVendor?.requisites || []).map(r => ({
        value: r.bankName,
      })),
    [currentVendor?.requisites],
  )
  const currentBank = useMemo(
    () => currentVendor?.requisitesMap[beneficiaryBank],
    [beneficiaryBank, currentVendor?.requisitesMap],
  )

  const accountNumberOptions = useMemo(
    () => (currentBank?.accounts || []).map(a => ({ value: a })),
    [currentBank?.accounts],
  )

  const { toggleTaxInPercentField, resetInitialValues, clearFieldsForManualEntry } = useRequisites({
    namePrefix,
    values: equipmentItem,
    currentBank,
    isCustomFields,
    isRequisitesFetched,
  })

  const handleManualEntryChange = useCallback(
    (manual: boolean) => {
      if (manual) {
        clearFieldsForManualEntry()
        setCustomFields(true)
      } else {
        setCustomFields(false)
        resetInitialValues()
      }
    },
    [clearFieldsForManualEntry, resetInitialValues, setCustomFields],
  )

  useEffect(() => {
    if (!isCustomFields && isRequisitesFetched) {
      setFieldValue(namePrefix + 'legalPerson', currentVendor?.vendorCode ? currentVendor?.vendorCode : '')
    }
  }, [currentVendor?.vendorCode, isCustomFields, isRequisitesFetched, namePrefix, setFieldValue])

  useEffect(() => {
    if (!isCustomFields && isRequisitesFetched) {
      setFieldValue(
        namePrefix + 'beneficiaryBank',
        currentVendor?.requisites?.find(r => r.bankName === beneficiaryBank)?.bankName || '',
      )
    }
  }, [
    beneficiaryBank,
    currentVendor?.requisites,
    isCustomFields,
    isRequisitesFetched,
    namePrefix,
    setFieldValue,
  ])

  useEffect(() => {
    if (currentVendor?.tax) {
      setFieldValue(namePrefix + 'taxPercent', currentVendor.tax)
      setFieldValue(namePrefix + 'taxValue', currentVendor.tax * parseInt(productCost || '0', 10))
    } else {
      setFieldValue(namePrefix + 'taxPercent', null)
      setFieldValue(namePrefix + 'taxValue', null)
    }
  }, [currentVendor?.tax, namePrefix, productCost, setFieldValue])

  return (
    <Box className={classes.editingAreaContainer}>
      {isRequisiteEditable && productOptions ? (
        <SelectInputFormik
          name={`${namePrefix}productType`}
          label="Тип доп оборудования"
          placeholder="-"
          options={filteredOptions}
          gridColumn="span 6"
        />
      ) : (
        <MaskedInputFormik
          name={`${namePrefix}productType`}
          label="Тип доп оборудования"
          placeholder="-"
          mask={maskNoRestrictions}
          gridColumn="span 6"
          disabled
        />
      )}
      <MaskedInputFormik
        name={`${namePrefix}productCost`}
        label="Стоимость"
        placeholder="-"
        mask={maskOnlyDigitsWithSeparator}
        gridColumn="span 3"
        disabled={!isRequisiteEditable}
      />
      <SwitchInputFormik
        name={`${namePrefix}isCredit`}
        label="В кредит"
        gridColumn="span 3"
        centered
        disabled={!isRequisiteEditable}
      />
      {isRequisiteEditable && (
        <Box className={classes.btnContainer} gridColumn="span 3">
          <CloseSquareBtn onClick={removeItem} />
          <AddingSquareBtn onClick={addItem} disabled={shouldDisableAdding} />
        </Box>
      )}

      <SelectInputFormik
        name={`${namePrefix}legalPerson`}
        label="Юридическое лицо"
        placeholder="-"
        options={vendorOptions}
        gridColumn="span 6"
      />
      <Box gridColumn="span 9" />

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

      {isCustomFields ? (
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
          value={isCustomFields}
          label="Ввести вручную"
          onChange={handleManualEntryChange}
          centered
          disabled
        />
      </Box>

      {isCustomFields && (
        <>
          <MaskedInputFormik
            name={`${namePrefix}correspondentAccount`}
            label="Расчетный счет"
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
