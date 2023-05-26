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
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { RadioGroupInput } from 'shared/ui/RadioGroupInput/RadioGroupInput'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'
import { AddingSquareBtn } from 'shared/ui/SquareBtn/AddingSquareBtn'
import { CloseSquareBtn } from 'shared/ui/SquareBtn/CloseSquareBtn'
import { SwitchInput } from 'shared/ui/SwitchInput/SwitchInput'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import { useAdditionalServices } from '../../../../../common/OrderCalculator/hooks/useAdditionalServices'
import { RequisitesDealerServices } from '../../__tests__/mocks/clientDetailedDossier.mock'
import { DossierRequisites } from '../EditRequisitesArea/EditRequisitesArea'
import { useStyles } from './DealerServicesRequisites.styles'

type Props = {
  requisites: RequisitesDealerServices[]
  index: number
  parentName: string
  isRequisiteEditable: boolean
  productOptions?: string[]
  arrayHelpers?: ArrayHelpers
  arrayLength?: number
  changeIds?: (idx: number, changingOption: string, minItems?: number) => void
}

const terms = ['12', '24', '36', '48', '60', '72']

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
  const { provider, bankAccountNumber, agent, beneficiaryBank, taxPresence, isCredit } =
    values.dealerAdditionalServices[index]
  const initialValues = useRef(values.dealerAdditionalServices[index])
  const { namePrefix, removeItem, addItem } = useAdditionalServices({
    parentName,
    index,
    arrayLength,
    arrayHelpers,
    changeIds,
  })
  const providers = requisites.map(requisite => requisite.provider)
  const [banksOptions, setBanksOptions] = useState<string[]>([beneficiaryBank])
  const [accountNumberOptions, setAccountNumberOptions] = useState<string[]>([bankAccountNumber])
  const [agentOptions, setAgentOptions] = useState<string[]>([agent])
  const [manualEntry, setManualEntry] = useState(false)
  const previousInsuranceCompany = usePrevious(provider)
  const previousAgent = usePrevious(agent)
  const previousBeneficiaryBank = usePrevious(beneficiaryBank)
  const previousAccountNumber = usePrevious(bankAccountNumber)

  const updateRequisites = useCallback(() => {
    const requisiteForProviders = requisites.find(requisite => requisite.provider === provider)
    if (requisiteForProviders) {
      setAgentOptions(requisiteForProviders.agents.map(receiver => receiver.agentName))
      const chosenAgent = requisiteForProviders.agents.find(receiver => receiver.agentName === agent)
      setBanksOptions(chosenAgent ? chosenAgent.banks.map(bank => bank.bankName) : [])
      const chosenBank = chosenAgent
        ? chosenAgent.banks.find(bank => bank.bankName === beneficiaryBank)
        : undefined
      setAccountNumberOptions(chosenBank ? chosenBank.accountNumbers : [])
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

  const handleInCreditChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue(`${namePrefix}loanTerm`, '')
      setFieldValue(`${namePrefix}documentId`, '')
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
          options={productOptions}
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
        afterChange={handleInCreditChange}
        centered
        disabled={!isRequisiteEditable}
      />
      {isRequisiteEditable && (
        <Box className={classes.btnContainer} gridColumn="span 1">
          <CloseSquareBtn onClick={removeItem} />
          <AddingSquareBtn onClick={addItem} />
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
      {isCredit ? (
        <>
          {isRequisiteEditable ? (
            <SelectInputFormik
              name={`${namePrefix}loanTerm`}
              label="Срок"
              placeholder="-"
              options={terms}
              gridColumn="span 3"
            />
          ) : (
            <MaskedInputFormik
              name={`${namePrefix}loanTerm`}
              label="Срок"
              placeholder="-"
              mask={maskDigitsOnly}
              gridColumn="span 3"
              disabled
            />
          )}
          <MaskedInputFormik
            name={`${namePrefix}documentId`}
            label="Номер полиса/сертификата"
            placeholder="-"
            mask={maskNoRestrictions}
            gridColumn="span 3"
            disabled={!(isRequisiteEditable || manualEntry)}
          />
        </>
      ) : (
        <Box gridColumn="span 6" />
      )}

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
          <MaskedInputFormik
            name={`${namePrefix}bankIdentificationCode`}
            label="БИК"
            placeholder="-"
            mask={maskBankIdentificationCode}
            gridColumn="span 3"
            disabled
          />
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
