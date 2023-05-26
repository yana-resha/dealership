import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Box } from '@mui/material'
import { ArrayHelpers, useFormikContext } from 'formik'

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
import { AddingSquareBtn } from 'shared/ui/SquareBtn/AddingSquareBtn'
import { CloseSquareBtn } from 'shared/ui/SquareBtn/CloseSquareBtn'
import { SwitchInput } from 'shared/ui/SwitchInput/SwitchInput'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import { useAdditionalServices } from '../../../../../common/OrderCalculator/hooks/useAdditionalServices'
import { RequisitesAdditionalOptions } from '../../__tests__/mocks/clientDetailedDossier.mock'
import { DossierRequisites } from '../EditRequisitesArea/EditRequisitesArea'
import { useStyles } from './AdditionalEquipmentRequisites.styles'

type Props = {
  requisites: RequisitesAdditionalOptions[]
  index: number
  parentName: string
  isRequisiteEditable: boolean
  productOptions?: string[]
  arrayHelpers?: ArrayHelpers
  arrayLength?: number
  changeIds?: (idx: number, changingOption: string, minItems?: number) => void
}

export function AdditionalEquipmentRequisites(props: Props) {
  const classes = useStyles()
  const {
    requisites,
    index,
    parentName,
    isRequisiteEditable,
    arrayHelpers,
    arrayLength,
    changeIds,
    productOptions,
  } = props
  const { values, setFieldValue } = useFormikContext<DossierRequisites>()
  const { legalPerson, beneficiaryBank, bankAccountNumber, taxPresence } = values.additionalEquipments[index]
  const { namePrefix, removeItem, addItem } = useAdditionalServices({
    parentName,
    index,
    arrayLength,
    arrayHelpers,
    changeIds,
  })
  const initialValues = useRef(values.additionalEquipments[index])
  const [manualEntry, setManualEntry] = useState(false)
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
      if (!manualEntry) {
        setFieldValue(`${namePrefix}bankIdentificationCode`, chosenBank ? chosenBank.bankBik : '')
        setFieldValue(`${namePrefix}correspondentAccount`, chosenBank ? chosenBank.bankCorrAccount : '')
      }
    } else {
      setBanksOptions([])
      setAccountNumberOptions([])
    }
  }, [requisites, legalPerson, beneficiaryBank, namePrefix])

  const toggleTaxInPercentField = useCallback(
    (value: boolean) => {
      setFieldValue(`${namePrefix}taxPresence`, value)
      setFieldValue(`${namePrefix}taxation`, value ? '' : '0')
    },
    [namePrefix],
  )

  const resetInitialValues = useCallback(() => {
    setFieldValue(`${namePrefix}taxPresence`, initialValues.current.taxPresence)
    setFieldValue(`${namePrefix}taxation`, initialValues.current.taxation)
    setFieldValue(`${namePrefix}correspondentAccount`, '')
    setFieldValue(`${namePrefix}bankIdentificationCode`, '')
    setFieldValue(`${namePrefix}beneficiaryBank`, '')
    setFieldValue(`${namePrefix}bankAccountNumber`, '')
    setAccountNumberOptions([])
  }, [namePrefix])

  const clearFieldsForManualEntry = useCallback(() => {
    setFieldValue(`${namePrefix}beneficiaryBank`, '')
    setFieldValue(`${namePrefix}bankAccountNumber`, '')
    setFieldValue(`${namePrefix}bankIdentificationCode`, '')
    setFieldValue(`${namePrefix}taxPresence`, false)
    setFieldValue(`${namePrefix}taxation`, '0')
    setFieldValue(`${namePrefix}correspondentAccount`, '')
  }, [namePrefix])

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
    [clearFieldsForManualEntry, resetInitialValues],
  )

  useEffect(() => {
    if (previousLegalPerson === legalPerson || beneficiaryBank === '' || manualEntry) {
      updateRequisites()
    } else {
      setFieldValue(`${namePrefix}beneficiaryBank`, '')
    }
  }, [legalPerson])

  useEffect(() => {
    if (previousReceiverBank !== beneficiaryBank && !manualEntry) {
      if (bankAccountNumber === '') {
        updateRequisites()
      } else {
        setFieldValue(`${namePrefix}bankAccountNumber`, '')
      }
    }
  }, [beneficiaryBank])

  useEffect(() => {
    if (previousAccountNumber !== bankAccountNumber && bankAccountNumber === '' && !manualEntry) {
      updateRequisites()
    }
  }, [bankAccountNumber])

  return (
    <Box className={classes.editingAreaContainer}>
      {isRequisiteEditable && productOptions ? (
        <SelectInputFormik
          name={`${namePrefix}productType`}
          label="Тип доп оборудования"
          placeholder="-"
          options={productOptions}
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
          <AddingSquareBtn onClick={addItem} />
        </Box>
      )}

      <SelectInputFormik
        name={`${namePrefix}legalPerson`}
        label="Юридическое лицо"
        placeholder="-"
        options={legalEntityOptions}
        gridColumn="span 6"
      />
      <Box gridColumn="span 9" />
      <MaskedInputFormik
        name={`${namePrefix}bankIdentificationCode`}
        label="БИК"
        placeholder="-"
        mask={maskBankIdentificationCode}
        gridColumn="span 3"
        disabled={!manualEntry}
      />

      {manualEntry ? (
        <>
          <MaskedInputFormik
            name={`${namePrefix}beneficiaryBank`}
            label="Банк получатель денежных средств"
            placeholder="-"
            mask={maskNoRestrictions}
            gridColumn="span 5"
          />
          <MaskedInputFormik
            name={`${namePrefix}bankAccountNumber`}
            label="Номер счета банка"
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
            gridColumn="span 5"
            disabled={!banksOptions.length}
          />
          <SelectInputFormik
            name={`${namePrefix}bankAccountNumber`}
            label="Номер Счета банка"
            placeholder="-"
            options={accountNumberOptions}
            gridColumn="span 4"
            disabled={!accountNumberOptions.length}
          />
        </>
      )}
      <Box gridColumn="span 3" width="auto" minWidth="min-content">
        <SwitchInput value={manualEntry} label="Ввести вручную" onChange={handleManualEntryChange} centered />
      </Box>

      {manualEntry && (
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
