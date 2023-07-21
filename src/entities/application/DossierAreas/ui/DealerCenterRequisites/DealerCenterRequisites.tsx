import { useCallback, useEffect, useMemo, useRef } from 'react'

import { Box } from '@mui/material'
import { useFormikContext } from 'formik'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
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

import { PreparedVendorWithoutBrokerMap } from '../../hooks/useRequisitesForFinancingQuery'
import { DossierRequisites } from '../EditRequisitesArea/EditRequisitesArea'
import { useStyles } from './DealerCenterRequisites.styles'

type Props = {
  vendor: PreparedVendorWithoutBrokerMap | undefined
  isRequisiteEditable: boolean
  namePrefix?: string
}

export function DealerCenterRequisites({ vendor, isRequisiteEditable, namePrefix = '' }: Props) {
  const classes = useStyles()
  const { vendorName, vendorCode } = getPointOfSaleFromCookies()
  const { values, setFieldValue } = useFormikContext<DossierRequisites>()
  const { beneficiaryBank, taxPresence, isCustomFields, loanAmount } = values
  const initialValues = useRef(values)

  const legalPersonOptions = useMemo(
    () => [{ value: vendorCode || '', label: vendorName }],
    [vendorCode, vendorName],
  )
  const banksOptions = useMemo(
    () => (vendor?.requisites || []).map(r => ({ value: r.bankName })),
    [vendor?.requisites],
  )
  const currentBank = useMemo(
    () => vendor?.requisitesMap[beneficiaryBank],
    [beneficiaryBank, vendor?.requisitesMap],
  )
  const accountNumberOptions = useMemo(
    () => (currentBank?.accounts || []).map(a => ({ value: a })),
    [currentBank?.accounts],
  )

  const toggleTaxInPercentField = useCallback(
    (value: boolean) => {
      setFieldValue(namePrefix + 'taxPresence', value)
      setFieldValue(namePrefix + 'taxation', value ? '' : '0')
    },
    [namePrefix, setFieldValue],
  )

  const resetInitialValues = useCallback(() => {
    setFieldValue(namePrefix + 'beneficiaryBank', '')
    setFieldValue(namePrefix + 'taxPresence', initialValues.current.taxPresence)
    setFieldValue(namePrefix + 'taxation', initialValues.current.taxation)
  }, [namePrefix, setFieldValue])

  const clearFieldsForManualEntry = useCallback(() => {
    setFieldValue(namePrefix + 'beneficiaryBank', '')
    setFieldValue(namePrefix + 'bankAccountNumber', '')
    setFieldValue(namePrefix + 'taxPresence', false)
    setFieldValue(namePrefix + 'taxation', '0')
    setFieldValue(namePrefix + 'correspondentAccount', '')
    setFieldValue(namePrefix + 'bankIdentificationCode', '')
  }, [namePrefix, setFieldValue])

  const handleManualEntryChange = useCallback(
    (manual: boolean) => {
      if (manual) {
        clearFieldsForManualEntry()
        setFieldValue(namePrefix + 'isCustomFields', true)
      } else {
        setFieldValue(namePrefix + 'isCustomFields', false)
        resetInitialValues()
      }
    },
    [clearFieldsForManualEntry, namePrefix, resetInitialValues, setFieldValue],
  )

  useEffect(() => {
    if (vendor?.tax) {
      setFieldValue(namePrefix + 'taxPercent', vendor.tax)
      setFieldValue(namePrefix + 'taxValue', vendor.tax * parseFloat(loanAmount))
    } else {
      setFieldValue(namePrefix + 'taxPercent', null)
      setFieldValue(namePrefix + 'taxValue', null)
    }
  }, [loanAmount, namePrefix, setFieldValue, vendor?.tax])

  useEffect(() => {
    if (!isCustomFields) {
      setFieldValue(namePrefix + 'bankIdentificationCode', currentBank?.bik || '')
      setFieldValue(namePrefix + 'correspondentAccount', currentBank?.accountCorrNumber || '')
      setFieldValue(
        namePrefix + 'bankAccountNumber',
        currentBank?.accounts?.length === 1 ? currentBank.accounts[0] : '',
      )
      setFieldValue(namePrefix + 'inn', currentBank?.inn || '', false)
      setFieldValue(namePrefix + 'ogrn', currentBank?.ogrn || '', false)
      setFieldValue(namePrefix + 'kpp', currentBank?.kpp || '', false)
    }
  }, [currentBank, isCustomFields, namePrefix, setFieldValue])

  return (
    <Box className={classes.editingAreaContainer}>
      <SelectInputFormik
        name={namePrefix + 'legalPerson'}
        label="Юридическое лицо"
        placeholder="-"
        options={legalPersonOptions}
        gridColumn="span 6"
        disabled
      />
      <MaskedInputFormik
        name={namePrefix + 'loanAmount'}
        label="Сумма кредита"
        placeholder="-"
        mask={maskOnlyDigitsWithSeparator}
        gridColumn="span 3"
        disabled={!isRequisiteEditable}
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
            label="Банк Получатель средств за авто"
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
            label="Банк Получатель средств за авто"
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
          label="Ввести вручную"
          onChange={handleManualEntryChange}
          centered
          // disabled
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
