import { useCallback, useEffect, useMemo } from 'react'

import { Box } from '@mui/material'
import { useFormikContext } from 'formik'

import { FULL_INITIAL_ADDITIONAL_SERVICE, fullInitialValueMap } from 'common/OrderCalculator/config'
import { FormFieldNameMap, FullOrderCalculatorFields } from 'common/OrderCalculator/types'
import { FieldLabels } from 'shared/constants/fieldLabels'
import { checkIsNumber, getTaxFromPercent } from 'shared/lib/helpers'
import {
  maskBankAccountNumber,
  maskBankIdentificationCode,
  maskNoRestrictions,
  maskOnlyDigitsWithSeparator,
} from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { RadioGroupInput } from 'shared/ui/RadioGroupInput/RadioGroupInput'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { SwitchInput } from 'shared/ui/SwitchInput/SwitchInput'
import { stringToNumber } from 'shared/utils/stringToNumber'

import { useRequisites } from '../../hooks/useRequisites'
import { useRequisitesContext } from '../RequisitesContext'
import { useStyles } from './DealerCenterRequisites.styles'

type Props = {
  isRequisiteEditable: boolean
  namePrefix?: string
}

export function DealerCenterRequisites({ namePrefix = '' }: Props) {
  const classes = useStyles()
  const { requisites, isRequisitesFetched } = useRequisitesContext()
  const { values, setFieldValue } = useFormikContext<FullOrderCalculatorFields>()
  const {
    beneficiaryBank,
    taxPresence,
    isCustomFields,
    carCost,
    initialPayment,
    additionalEquipments,
    dealerAdditionalServices,
    bankAdditionalServices,
  } = values

  const carCostNum = stringToNumber(carCost) || 0
  const initialPaymentNum = stringToNumber(initialPayment) || 0

  const legalPersonOptions = useMemo(
    () =>
      requisites?.vendor.vendorCode && requisites?.vendor.vendorName
        ? [
            {
              value: requisites.vendor.vendorCode,
              label: requisites.vendor.vendorName,
            },
          ]
        : [],
    [requisites?.vendor.vendorCode, requisites?.vendor.vendorName],
  )

  const currentLegalPerson = useMemo(() => requisites?.vendor, [requisites?.vendor])

  const banksOptions = useMemo(
    () => (currentLegalPerson?.requisites || []).map(r => ({ value: r.bankName })),
    [currentLegalPerson?.requisites],
  )

  const currentBank = useMemo(
    () => currentLegalPerson?.requisitesMap[beneficiaryBank],
    [beneficiaryBank, currentLegalPerson?.requisitesMap],
  )

  const accountNumberOptions = useMemo(
    () => (currentBank?.accounts || []).map(a => ({ value: a })),
    [currentBank?.accounts],
  )

  const { toggleTaxInPercentField, resetInitialValues, clearFieldsForManualEntry } = useRequisites({
    namePrefix,
    values,
    currentBroker: currentLegalPerson,
    currentBank,
    isCustomFields,
    isRequisitesFetched,
  })

  const handleManualEntryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        clearFieldsForManualEntry()
        setFieldValue(namePrefix + 'isCustomFields', true)
      } else {
        setFieldValue(namePrefix + 'isCustomFields', false)
        resetInitialValues()
      }
    },
    [clearFieldsForManualEntry, namePrefix, resetInitialValues, setFieldValue],
  )

  const priceOfAdditionalOptionsInCredit = useMemo(() => {
    const equipmentCost = additionalEquipments?.reduce((acc, option) => {
      if (option[FormFieldNameMap.isCredit]) {
        acc += stringToNumber(option[FormFieldNameMap.productCost]) ?? 0
      }

      return acc
    }, 0)
    const dealerServicesConst = dealerAdditionalServices?.reduce((acc, option) => {
      if (option[FormFieldNameMap.isCredit]) {
        acc += stringToNumber(option[FormFieldNameMap.productCost]) ?? 0
      }

      return acc
    }, 0)
    const bankServicesConst = bankAdditionalServices?.reduce((acc, option) => {
      // банковские допы всегда в кредит
      acc += stringToNumber(option[FormFieldNameMap.productCost]) ?? 0

      return acc
    }, 0)

    return equipmentCost + dealerServicesConst + bankServicesConst
  }, [additionalEquipments, bankAdditionalServices, dealerAdditionalServices])

  useEffect(() => {
    const loanAmount = carCostNum + priceOfAdditionalOptionsInCredit - initialPaymentNum
    setFieldValue(
      namePrefix + 'loanAmount',
      loanAmount >= 0 ? `${loanAmount}` : fullInitialValueMap[FormFieldNameMap.loanAmount],
    )
    // Исключены лишние зависимости, чтобы избежать случайных перерендеров
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carCostNum, initialPaymentNum, priceOfAdditionalOptionsInCredit])

  useEffect(() => {
    setFieldValue(namePrefix + 'legalPersonName', currentLegalPerson?.vendorName)
    // Исключен setFieldValue, чтобы избежать случайных перерендеров
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLegalPerson?.vendorName, namePrefix])

  useEffect(() => {
    const tax = currentLegalPerson?.tax
    setFieldValue(
      namePrefix + 'taxPercent',
      checkIsNumber(tax) ? tax : FULL_INITIAL_ADDITIONAL_SERVICE.taxPercent,
    )
    setFieldValue(
      namePrefix + 'taxValue',
      checkIsNumber(tax)
        ? getTaxFromPercent(carCostNum - initialPaymentNum, tax)
        : FULL_INITIAL_ADDITIONAL_SERVICE.taxValue,
    )
  }, [carCostNum, currentLegalPerson?.tax, initialPaymentNum, namePrefix, setFieldValue])

  return (
    <Box className={classes.editingAreaContainer} data-testid="DealerCenterRequisites">
      <SelectInputFormik
        name={namePrefix + 'legalPersonCode'}
        label="Юридическое лицо"
        placeholder="-"
        options={legalPersonOptions}
        gridColumn="span 6"
      />
      <MaskedInputFormik
        name={namePrefix + 'loanAmount'}
        label="Сумма кредита"
        placeholder="-"
        mask={maskOnlyDigitsWithSeparator}
        gridColumn="span 3"
        disabled
      />
      <Box gridColumn="span 6" />

      {isCustomFields ? (
        <>
          <MaskedInputFormik
            name={namePrefix + 'bankIdentificationCode'}
            label="БИК"
            placeholder="-"
            mask={maskBankIdentificationCode}
            gridColumn="span 3"
          />
          <MaskedInputFormik
            name={namePrefix + 'beneficiaryBank'}
            label="Банк получатель денежных средств"
            placeholder="-"
            mask={maskNoRestrictions}
            gridColumn="span 5"
          />
          <MaskedInputFormik
            name={namePrefix + 'bankAccountNumber'}
            label="Расчетный счет"
            placeholder="-"
            mask={maskBankAccountNumber}
            gridColumn="span 4"
          />
        </>
      ) : (
        <>
          <SelectInputFormik
            name={namePrefix + 'beneficiaryBank'}
            label="Банк получатель денежных средств"
            placeholder="-"
            options={banksOptions}
            gridColumn="span 6"
          />
          <SelectInputFormik
            name={namePrefix + 'bankAccountNumber'}
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
          id="manualInput"
          value={isCustomFields}
          label={FieldLabels.MANUAL_ENTRY}
          onChange={handleManualEntryChange}
          centered
          disabled
        />
      </Box>

      {isCustomFields && (
        <>
          <MaskedInputFormik
            name={namePrefix + 'correspondentAccount'}
            label="Кор. счет"
            placeholder="-"
            mask={maskBankAccountNumber}
            gridColumn="span 6"
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
            name={namePrefix + 'taxation'}
            label="Налог"
            placeholder="-"
            mask={maskOnlyDigitsWithSeparator}
            gridColumn="span 3"
            disabled={!taxPresence}
          />
        </>
      )}
    </Box>
  )
}
