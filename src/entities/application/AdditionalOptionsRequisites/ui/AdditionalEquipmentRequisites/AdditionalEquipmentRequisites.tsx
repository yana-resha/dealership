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

import { DOCUMENT_TYPES, ServicesGroupName } from '../../configs/additionalOptionsRequisites.config'
import { useAdditionalServices } from '../../hooks/useAdditionalServices'
import { useAdditionalServicesOptions } from '../../hooks/useAdditionalServicesOptions'
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
  arrayLength: number
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
  const { productType, legalPersonCode, beneficiaryBank, taxPresence, productCost, isCredit } = equipmentItem
  const [isCustomFields, setCustomFields] = useState(false)
  const { requisites, isRequisitesFetched } = useRequisitesContext()

  const { namePrefix, isLastItem, removeItem, addItem } = useAdditionalServices({
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
    () => requisites?.additionalEquipmentsMap?.[productType ?? ''],
    [requisites?.additionalEquipmentsMap, productType],
  )

  const currentProvider = useMemo(
    () => optionRequisite?.providerBrokersMap && Object.values(optionRequisite?.providerBrokersMap)[0],
    [optionRequisite?.providerBrokersMap],
  )

  const brokerOptions = useMemo(
    () =>
      (currentProvider?.brokers || []).map(v => ({
        value: v.brokerCode,
        label: v.brokerName,
      })),
    [currentProvider?.brokers],
  )

  const currentBroker = useMemo(
    () => currentProvider?.brokersMap?.[legalPersonCode],
    [currentProvider?.brokersMap, legalPersonCode],
  )

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
      setFieldValue(
        namePrefix + 'legalPersonCode',
        currentBroker?.brokerCode ? currentBroker?.brokerCode : '',
      )
    }
  }, [currentBroker?.brokerCode, isCustomFields, isRequisitesFetched, namePrefix, setFieldValue])

  useEffect(() => {
    setFieldValue(namePrefix + 'legalPersonName', currentBroker?.brokerName)
  }, [currentBroker?.brokerName, namePrefix, setFieldValue])

  useEffect(() => {
    if (!isCustomFields && isRequisitesFetched) {
      setFieldValue(
        namePrefix + 'beneficiaryBank',
        currentBroker?.requisites?.find(r => r.bankName === beneficiaryBank)?.bankName || '',
      )
    }
  }, [
    beneficiaryBank,
    currentBroker?.requisites,
    isCustomFields,
    isRequisitesFetched,
    namePrefix,
    setFieldValue,
  ])

  useEffect(() => {
    if (currentBroker?.tax) {
      setFieldValue(namePrefix + 'taxPercent', currentBroker.tax)
      setFieldValue(namePrefix + 'taxValue', currentBroker.tax * parseInt(productCost || '0', 10))
    } else {
      setFieldValue(namePrefix + 'taxPercent', 0)
      setFieldValue(namePrefix + 'taxValue', 0)
    }
  }, [currentBroker?.tax, namePrefix, productCost, setFieldValue])

  useEffect(() => {
    if (!isCredit) {
      setFieldValue(namePrefix + 'legalPersonCode', '')
      setFieldValue(namePrefix + 'documentType', null)
      setFieldValue(namePrefix + 'documentNumber', '')
      setFieldValue(namePrefix + 'documentDate', null)
      setFieldValue(namePrefix + 'bankIdentificationCode', '')
      setFieldValue(namePrefix + 'beneficiaryBank', '')
      setFieldValue(namePrefix + 'bankAccountNumber', '')
      setFieldValue(namePrefix + 'correspondentAccount', undefined)
      setFieldValue(namePrefix + 'taxPresence', undefined)
      setFieldValue(namePrefix + 'taxation', undefined)
    }
  }, [isCredit, namePrefix, setFieldValue])

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
          {isLastItem && <AddingSquareBtn onClick={addItem} disabled={shouldDisableAdding} />}
          <CloseSquareBtn onClick={removeItem} />
        </Box>
      )}

      {isCredit && (
        <>
          <SelectInputFormik
            name={`${namePrefix}legalPersonCode`}
            label="Юридическое лицо"
            placeholder="-"
            options={brokerOptions}
            gridColumn="span 6"
          />
          <Box gridColumn="span 9" />

          <SelectInputFormik
            name={`${namePrefix}documentType`}
            label="Тип документа"
            placeholder="-"
            options={DOCUMENT_TYPES}
            gridColumn="span 6"
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
        </>
      )}
    </Box>
  )
}
