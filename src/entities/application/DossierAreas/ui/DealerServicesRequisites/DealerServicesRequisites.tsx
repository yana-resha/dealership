import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Box } from '@mui/material'
import { ArrayHelpers, useFormikContext } from 'formik'

import { usePrevious } from 'shared/hooks/usePrevious'
import {
  maskBankAccountNumber,
  maskBankIdentificationCode,
  maskDigitsOnly,
  maskNoRestrictions,
  maskOnlyDigitsWithSeparator,
} from 'shared/masks/InputMasks'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { RadioGroupInput } from 'shared/ui/RadioGroupInput/RadioGroupInput'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { AddingSquareBtn } from 'shared/ui/SquareBtn/AddingSquareBtn'
import { CloseSquareBtn } from 'shared/ui/SquareBtn/CloseSquareBtn'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import { RequisitesDealerServices } from '../../__tests__/mocks/clientDetailedDossier.mock'
import { DOCUMENT_TYPES } from '../../configs/editRequisitesValidation'
import { useAdditionalServices } from '../../hooks/useAdditionalServices'
import { ServicesGroupName, useAdditionalServicesOptions } from '../../hooks/useAdditionalServicesOptions'
import { useBanksOptions } from '../../hooks/useBanksOptions'
import { DossierRequisites } from '../EditRequisitesArea/EditRequisitesArea'
import { useStyles } from './DealerServicesRequisites.styles'

type Props = {
  requisites: RequisitesDealerServices[]
  index: number
  parentName: ServicesGroupName
  isRequisiteEditable: boolean
  productOptions?: {
    value: string | number
    label: string
  }[]
  arrayHelpers?: ArrayHelpers
  arrayLength?: number
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

export function DealerServicesRequisites(props: Props) {
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
  const { provider, bankAccountNumber, agent, beneficiaryBank, taxPresence } =
    values.dealerAdditionalServices[index]
  const initialValues = useRef(values.dealerAdditionalServices[index])
  const { namePrefix, removeItem, addItem } = useAdditionalServices({
    parentName,
    index,
    arrayLength,
    arrayHelpers,
    changeIds,
  })
  const providers = requisites.map(requisite => ({ value: requisite.provider }))

  const [agentOptions, setAgentOptions] = useState<{ value: string }[]>([{ value: agent }])
  const previousInsuranceCompany = usePrevious(provider)
  const previousAgent = usePrevious(agent)
  const previousBeneficiaryBank = usePrevious(beneficiaryBank)

  const {
    banksOptions,
    setBanksOptions,
    accountNumberOptions,
    setAccountNumberOptions,
    manualEntry,
    setManualEntry,
    previousAccountNumber,
  } = useBanksOptions({ beneficiaryBank, bankAccountNumber })

  const { filteredOptions, shouldDisableAdding } = useAdditionalServicesOptions({
    values,
    index,
    parentName,
    options: productOptions,
  })

  const updateRequisites = useCallback(() => {
    const requisiteForProviders = requisites.find(requisite => requisite.provider === provider)
    if (requisiteForProviders) {
      setAgentOptions(requisiteForProviders.agents.map(receiver => ({ value: receiver.agentName })))
      const chosenAgent = requisiteForProviders.agents.find(receiver => receiver.agentName === agent)
      setBanksOptions(chosenAgent ? chosenAgent.banks.map(bank => ({ value: bank.bankName })) : [])
      const chosenBank = chosenAgent
        ? chosenAgent.banks.find(bank => bank.bankName === beneficiaryBank)
        : undefined
      setAccountNumberOptions(chosenBank ? chosenBank.accountNumbers.map(a => ({ value: a })) : [])
      if (!manualEntry) {
        setFieldValue(`${namePrefix}bankIdentificationCode`, chosenBank ? chosenBank.bankBik : '')
        setFieldValue(`${namePrefix}correspondentAccount`, chosenBank ? chosenBank.bankCorrAccount : '')
      }
    } else {
      setAgentOptions([])
      setBanksOptions([])
      setAccountNumberOptions([])
    }
  }, [requisites, provider, agent, beneficiaryBank, namePrefix])

  const resetInitialValues = useCallback(() => {
    if (!isRequisiteEditable) {
      setFieldValue(`${namePrefix}documentId`, initialValues.current.documentId)
    }
    setFieldValue(`${namePrefix}taxPresence`, initialValues.current.taxPresence)
    setFieldValue(`${namePrefix}taxation`, initialValues.current.taxation)
    setFieldValue(`${namePrefix}correspondentAccount`, '')
    setFieldValue(`${namePrefix}bankIdentificationCode`, '')
    setFieldValue(`${namePrefix}beneficiaryBank`, '')
    setFieldValue(`${namePrefix}bankAccountNumber`, '')
    setAccountNumberOptions([])
  }, [namePrefix])

  const clearFieldsForManualEntry = useCallback(() => {
    if (!isRequisiteEditable) {
      setFieldValue(`${namePrefix}documentId`, '')
    }
    setFieldValue(`${namePrefix}beneficiaryBank`, '')
    setFieldValue(`${namePrefix}bankAccountNumber`, '')
    setFieldValue(`${namePrefix}bankIdentificationCode`, '')
    setFieldValue(`${namePrefix}taxPresence`, false)
    setFieldValue(`${namePrefix}taxation`, '0')
    setFieldValue(`${namePrefix}correspondentAccount`, '')
  }, [namePrefix])

  //Метод активирует поля для ручного ввода реквизитов. Не используется, пока отключен ручной ввод
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

  const toggleTaxInPercentField = useCallback(
    (value: boolean) => {
      setFieldValue(`${namePrefix}taxPresence`, value)
      setFieldValue(`${namePrefix}taxation`, value ? '' : '0')
    },
    [namePrefix],
  )

  useEffect(() => {
    if (previousInsuranceCompany === provider || agent === '') {
      updateRequisites()
    } else {
      setFieldValue(`${namePrefix}agent`, '')
    }
  }, [provider])

  useEffect(() => {
    if (previousAgent !== agent) {
      if (beneficiaryBank === '' || manualEntry) {
        updateRequisites()
      } else {
        setFieldValue(`${namePrefix}beneficiaryBank`, '')
      }
    }
  }, [agent])

  useEffect(() => {
    if (previousBeneficiaryBank !== beneficiaryBank && !manualEntry) {
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
        options={providers}
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
        options={agentOptions}
        gridColumn="span 6"
        disabled={!agentOptions.length}
      />
      <MaskedInputFormik
        name={`${namePrefix}productCost`}
        label="Стоимость"
        placeholder="-"
        mask={maskOnlyDigitsWithSeparator}
        gridColumn="span 3"
        disabled={!isRequisiteEditable}
      />
      <SelectInputFormik
        name={`${namePrefix}loanTerm`}
        label="Срок"
        placeholder="-"
        options={terms}
        gridColumn="span 3"
      />

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
      {manualEntry ? (
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
            gridColumn="span 6"
            disabled={!banksOptions.length}
          />
          <SelectInputFormik
            name={`${namePrefix}bankAccountNumber`}
            label="Номер Счета банка"
            placeholder="-"
            options={accountNumberOptions}
            gridColumn="span 6"
            disabled={!accountNumberOptions.length}
          />
        </>
      )}
      {manualEntry && (
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
