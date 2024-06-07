import { useCallback, useEffect, useMemo, useState } from 'react'

import { Box } from '@mui/material'
import { OptionID } from '@sberauto/dictionarydc-proto/public'
import { ArrayHelpers, useField, useFormikContext } from 'formik'

import { FULL_INITIAL_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import {
  FormFieldNameMap,
  FullInitialAdditionalService,
  FullOrderCalculatorFields,
} from 'common/OrderCalculator/types'
import {
  maskBankAccountNumber,
  maskBankIdentificationCode,
  maskNoRestrictions,
  maskOnlyDigitsWithSeparator,
  maskPrice,
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
import { useStyles } from './DealerServicesRequisites.styles'

type Props = {
  index: number
  parentName: ServicesGroupName
  isNecessaryCasco?: boolean
  isLoadedCreditProducts?: boolean
  isRequisiteEditable: boolean
  productOptions?: {
    value: string | number
    label: string
  }[]
  arrayHelpers?: ArrayHelpers
  arrayLength: number
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
  index,
  parentName,
  isNecessaryCasco = false,
  isLoadedCreditProducts = false,
  isRequisiteEditable,
  arrayHelpers,
  arrayLength,
  servicesItem,
  changeIds,
  productOptions,
}: Props) {
  const classes = useStyles()

  const { values, setFieldValue, submitCount } = useFormikContext<FullOrderCalculatorFields>()
  const { provider, agent, beneficiaryBank, taxPresence, productCost, productType, cascoLimit, isCredit } =
    servicesItem
  const [isCustomFields, setCustomFields] = useState(false)

  const { requisites, isRequisitesFetched } = useRequisitesContext()

  const { namePrefix, isLastItem, removeItem, addItem } = useAdditionalServices({
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

  const optionRequisite = useMemo(
    () => requisites?.dealerOptionsMap?.[productType ?? ''],
    [requisites?.dealerOptionsMap, productType],
  )

  const providerOptions = useMemo(
    () =>
      (optionRequisite?.providerBrokers || []).map(v => ({
        value: v.providerCode,
        label: v.providerName,
      })),
    [optionRequisite?.providerBrokers],
  )

  const currentProvider = useMemo(
    () => optionRequisite?.providerBrokersMap[provider],
    [optionRequisite?.providerBrokersMap, provider],
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
    () => currentProvider?.brokersMap[agent],
    [agent, currentProvider?.brokersMap],
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
    values: servicesItem,
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
        namePrefix + 'provider',
        currentProvider?.providerCode ? currentProvider?.providerCode : '',
      )
    }
  }, [currentProvider?.providerCode, isCustomFields, isRequisitesFetched, namePrefix, setFieldValue])

  useEffect(() => {
    setFieldValue(namePrefix + 'providerName', currentProvider?.providerName)
    // Исключен setFieldValue, чтобы избежать случайных перерендеров
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProvider?.providerName, namePrefix])

  useEffect(() => {
    setFieldValue(namePrefix + 'agentName', currentBroker?.brokerName)
    // Исключен setFieldValue, чтобы избежать случайных перерендеров
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBroker?.brokerName, namePrefix])

  useEffect(() => {
    if (!isCustomFields && isRequisitesFetched) {
      setFieldValue(
        namePrefix + 'beneficiaryBank',
        currentBroker?.requisitesMap?.[beneficiaryBank]?.bankName || '',
      )
    }
  }, [
    beneficiaryBank,
    currentBroker?.requisitesMap,
    isCustomFields,
    isRequisitesFetched,
    namePrefix,
    setFieldValue,
  ])

  useEffect(() => {
    if (currentBroker?.tax) {
      setFieldValue(namePrefix + 'agentTaxPercent', currentBroker.tax)
      setFieldValue(namePrefix + 'agentTaxValue', currentBroker.tax * parseFloat(productCost || '0'))
    } else {
      setFieldValue(namePrefix + 'agentTaxPercent', 0)
      setFieldValue(namePrefix + 'agentTaxValue', 0)
    }
  }, [currentBroker?.tax, namePrefix, productCost, setFieldValue])

  const isCascoProductType = productType === OptionID.CASCO
  const isShouldShowCascoLimitField =
    isNecessaryCasco && parentName === ServicesGroupName.dealerAdditionalServices && isCascoProductType

  const [, cascoLimitMeta, { setTouched: setCascoLimitTouched }] = useField<string>(`${namePrefix}cascoLimit`)
  useEffect(() => {
    if (isShouldShowCascoLimitField && !cascoLimitMeta.touched && !!submitCount) {
      setCascoLimitTouched(true)
    }
    // Исключили setCascoLimitTouched что бы избежать случайного перерендера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cascoLimitMeta.touched, isShouldShowCascoLimitField, submitCount])

  useEffect(() => {
    if (isLoadedCreditProducts && !isShouldShowCascoLimitField && cascoLimit) {
      setFieldValue(namePrefix + 'cascoLimit', '')
    }
  }, [cascoLimit, isLoadedCreditProducts, isShouldShowCascoLimitField, namePrefix, setFieldValue])

  useEffect(() => {
    if (isCredit) {
      return
    }
    setFieldValue(namePrefix + 'agent', '')
    setFieldValue(namePrefix + 'bankIdentificationCode', '')
    setFieldValue(namePrefix + 'beneficiaryBank', '')
    setFieldValue(namePrefix + 'bankAccountNumber', '')
    setFieldValue(namePrefix + 'correspondentAccount', undefined)
    setFieldValue(namePrefix + 'taxPresence', undefined)
    setFieldValue(namePrefix + 'taxation', undefined)

    if (!isCascoProductType) {
      setFieldValue(namePrefix + 'provider', '')
    }

    if (!isShouldShowCascoLimitField) {
      setFieldValue(namePrefix + 'loanTerm', undefined)
      setFieldValue(namePrefix + 'documentType', null)
      setFieldValue(namePrefix + 'documentNumber', '')
      setFieldValue(namePrefix + 'documentDate', null)
    }
  }, [isCascoProductType, isCredit, isShouldShowCascoLimitField, namePrefix, setFieldValue])

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

      {(isCredit || isCascoProductType) && (
        <SelectInputFormik
          name={`${namePrefix}provider`}
          label="Страховая компания или поставщик"
          placeholder="-"
          options={providerOptions}
          gridColumn="span 6"
        />
      )}

      {!isCredit && !isCascoProductType && (
        <MaskedInputFormik
          name={namePrefix + FormFieldNameMap.productCost}
          label="Стоимость"
          placeholder="-"
          mask={maskPrice}
          gridColumn="span 3"
        />
      )}

      <SwitchInputFormik
        name={`${namePrefix}isCredit`}
        label="В кредит"
        gridColumn={isCredit || isCascoProductType ? 'span 2' : 'span 3'}
        centered
        disabled={!isRequisiteEditable}
      />

      {isRequisiteEditable && (
        <Box
          className={classes.btnContainer}
          gridColumn={isCredit || isCascoProductType ? 'span 1' : 'span 3'}
        >
          {isLastItem && <AddingSquareBtn onClick={addItem} disabled={shouldDisableAdding} />}
          <CloseSquareBtn onClick={removeItem} />
        </Box>
      )}

      {!isCredit && isCascoProductType && (
        <>
          {isShouldShowCascoLimitField && (
            <SelectInputFormik
              name={`${namePrefix}loanTerm`}
              label="Срок"
              placeholder="-"
              options={terms}
              gridColumn="span 3"
            />
          )}
          <MaskedInputFormik
            name={namePrefix + FormFieldNameMap.productCost}
            label="Стоимость"
            placeholder="-"
            mask={maskPrice}
            gridColumn="span 3"
          />

          {isShouldShowCascoLimitField && (
            <MaskedInputFormik
              name={`${namePrefix}cascoLimit`}
              label="Сумма покрытия КАСКО"
              placeholder="-"
              mask={maskPrice}
              gridColumn="span 4"
              disabled={!isRequisiteEditable}
            />
          )}
        </>
      )}

      {isCredit && (
        <>
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
            mask={maskPrice}
            gridColumn="span 3"
            disabled={!isRequisiteEditable}
          />
          {isShouldShowCascoLimitField && (
            <MaskedInputFormik
              name={`${namePrefix}cascoLimit`}
              label="Сумма покрытия КАСКО"
              placeholder="-"
              mask={maskPrice}
              gridColumn="span 3"
              disabled={!isRequisiteEditable}
            />
          )}
        </>
      )}

      {(isCredit || isShouldShowCascoLimitField) && (
        <>
          <SelectInputFormik
            name={`${namePrefix}documentType`}
            label="Тип документа"
            placeholder="-"
            options={DOCUMENT_TYPES}
            gridColumn="1/7"
          />
          <MaskedInputFormik
            name={`${namePrefix}documentNumber`}
            label="Номер документа"
            placeholder="-"
            mask={maskNoRestrictions}
            gridColumn="span 4"
          />
          <DateInputFormik name={`${namePrefix}documentDate`} label="Дата документа" gridColumn="span 4" />
        </>
      )}

      {isCredit && (
        <>
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
