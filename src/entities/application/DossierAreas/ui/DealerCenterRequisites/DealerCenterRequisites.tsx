import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Box } from '@mui/material'
import { useFormikContext } from 'formik'

import { usePrevious } from 'shared/hooks/usePrevious'
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

import { RequisitesAdditionalOptions } from '../../__tests__/mocks/clientDetailedDossier.mock'
import { DossierRequisites } from '../EditRequisitesArea/EditRequisitesArea'
import { useStyles } from './DealerCenterRequisites.styles'

type Props = {
  requisites: RequisitesAdditionalOptions[]
  isRequisiteEditable: boolean
  namePrefix?: string
}

export function DealerCenterRequisites({ requisites, isRequisiteEditable, namePrefix = '' }: Props) {
  const classes = useStyles()
  const { values, setFieldValue } = useFormikContext<DossierRequisites>()
  const { legalPerson, beneficiaryBank, bankAccountNumber, taxPresence, isCustomFields } = values
  const initialValues = useRef(values)
  const legalEntityOptions = requisites.map(requisite => requisite.legalEntityName)
  const [banksOptions, setBanksOptions] = useState<string[]>([beneficiaryBank])
  const [accountNumberOptions, setAccountNumberOptions] = useState<string[]>([bankAccountNumber])
  const previousLegalPerson = usePrevious(legalPerson)
  const previousReceiverBank = usePrevious(beneficiaryBank)
  const previousAccountNumber = usePrevious(bankAccountNumber)

  const updateRequisites = useCallback(() => {
    const requisiteForLegalName = requisites.find(requisite => requisite.legalEntityName === legalPerson)
    if (requisiteForLegalName) {
      setBanksOptions(requisiteForLegalName.banks.map(bank => bank.bankName))
      const chosenBank = requisiteForLegalName.banks.find(bank => bank.bankName === beneficiaryBank)
      setAccountNumberOptions(chosenBank ? chosenBank.accountNumbers : [])
      if (!isCustomFields) {
        setFieldValue(namePrefix + 'bankIdentificationCode', chosenBank ? chosenBank.bankBik : '')
        setFieldValue(namePrefix + 'correspondentAccount', chosenBank ? chosenBank.bankCorrAccount : '')
      }
    }
  }, [requisites, legalPerson, beneficiaryBank])

  const toggleTaxInPercentField = useCallback((value: boolean) => {
    setFieldValue(namePrefix + 'taxPresence', value)
    setFieldValue(namePrefix + 'taxation', value ? '' : '0')
  }, [])

  const resetInitialValues = useCallback(() => {
    setFieldValue(namePrefix + 'bankAccountNumber', '')
    setFieldValue(namePrefix + 'beneficiaryBank', '')
    setFieldValue(namePrefix + 'taxPresence', initialValues.current.taxPresence)
    setFieldValue(namePrefix + 'taxation', initialValues.current.taxation)
  }, [])

  const clearFieldsForManualEntry = useCallback(() => {
    setFieldValue(namePrefix + 'beneficiaryBank', '')
    setFieldValue(namePrefix + 'bankAccountNumber', '')
    setFieldValue(namePrefix + 'correspondentAccount', '')
    setFieldValue(namePrefix + 'taxPresence', false)
    setFieldValue(namePrefix + 'taxation', '0')
    setFieldValue(namePrefix + 'bankIdentificationCode', '')
  }, [])

  const handleManualEntryChange = useCallback((manual: boolean) => {
    if (manual) {
      clearFieldsForManualEntry()
      setFieldValue(namePrefix + 'isCustomFields', true)
    } else {
      setFieldValue(namePrefix + 'isCustomFields', false)
      resetInitialValues()
    }
  }, [])

  useEffect(() => {
    if (previousLegalPerson === legalPerson || beneficiaryBank === '' || isCustomFields) {
      updateRequisites()
    } else {
      setFieldValue(namePrefix + 'beneficiaryBank', '')
    }
  }, [legalPerson])

  useEffect(() => {
    if (previousReceiverBank !== beneficiaryBank && !isCustomFields) {
      if (bankAccountNumber === '') {
        updateRequisites()
      } else {
        setFieldValue(namePrefix + 'bankAccountNumber', '')
      }
    }
  }, [beneficiaryBank])

  useEffect(() => {
    if (previousAccountNumber !== bankAccountNumber && bankAccountNumber === '' && !isCustomFields) {
      updateRequisites()
    }
  }, [bankAccountNumber])

  return (
    <Box className={classes.editingAreaContainer}>
      <SelectInputFormik
        name={namePrefix + 'legalPerson'}
        label="Юридическое лицо"
        placeholder="-"
        options={legalEntityOptions}
        gridColumn="span 6"
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
      <MaskedInputFormik
        name={namePrefix + 'bankIdentificationCode'}
        label="БИК"
        placeholder="-"
        mask={maskBankIdentificationCode}
        gridColumn="span 3"
        disabled={!isCustomFields}
      />

      {isCustomFields ? (
        <>
          <MaskedInputFormik
            name={namePrefix + 'beneficiaryBank'}
            label="Банк Получатель средств за авто"
            placeholder="-"
            mask={maskNoRestrictions}
            gridColumn="span 5"
          />
          <MaskedInputFormik
            name={namePrefix + 'bankAccountNumber'}
            label="Номер Счета банка"
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
            gridColumn="span 5"
          />
          <SelectInputFormik
            name={namePrefix + 'bankAccountNumber'}
            label="Номер Счета банка"
            placeholder="-"
            options={accountNumberOptions}
            gridColumn="span 4"
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
