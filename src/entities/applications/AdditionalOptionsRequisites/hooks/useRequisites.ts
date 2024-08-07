import { useCallback, useEffect, useRef } from 'react'

import { useFormikContext } from 'formik'

import { INITIAL_BANK_DETAILS_VALUE } from 'common/OrderCalculator/config'
import {
  FullInitialAdditionalEquipments,
  FullInitialAdditionalService,
  FullOrderCalculatorFields,
} from 'common/OrderCalculator/types'

import { PreparedBroker, PreparedVendor, RequiredRequisite } from './useRequisitesForFinancingQuery'

type Params = {
  namePrefix: string
  values: FullOrderCalculatorFields | FullInitialAdditionalEquipments | FullInitialAdditionalService
  currentBroker: PreparedBroker | PreparedVendor | undefined
  currentBank: RequiredRequisite | undefined
  isCustomFields: boolean
  isRequisitesFetched: boolean
}

export function useRequisites({
  namePrefix,
  values,
  currentBroker,
  currentBank,
  isCustomFields,
  isRequisitesFetched,
}: Params) {
  const { setFieldValue } = useFormikContext<FullOrderCalculatorFields>()
  const { bankAccountNumber } = values
  const initialValues = useRef(values)

  const toggleTaxInPercentField = useCallback(
    (value: boolean) => {
      setFieldValue(`${namePrefix}taxPresence`, value)
      setFieldValue(`${namePrefix}taxation`, value ? INITIAL_BANK_DETAILS_VALUE.taxation : '0')
    },
    [namePrefix, setFieldValue],
  )

  const resetInitialValues = useCallback(() => {
    setFieldValue(`${namePrefix}beneficiaryBank`, INITIAL_BANK_DETAILS_VALUE.beneficiaryBank)
    setFieldValue(`${namePrefix}taxPresence`, initialValues.current.taxPresence)
    setFieldValue(`${namePrefix}taxation`, initialValues.current.taxation)
  }, [namePrefix, setFieldValue])

  const clearFieldsForManualEntry = useCallback(() => {
    setFieldValue(`${namePrefix}beneficiaryBank`, INITIAL_BANK_DETAILS_VALUE.beneficiaryBank)
    setFieldValue(`${namePrefix}bankAccountNumber`, INITIAL_BANK_DETAILS_VALUE.bankAccountNumber)
    setFieldValue(`${namePrefix}bankIdentificationCode`, INITIAL_BANK_DETAILS_VALUE.bankIdentificationCode)
    setFieldValue(`${namePrefix}correspondentAccount`, INITIAL_BANK_DETAILS_VALUE.correspondentAccount)
    setFieldValue(`${namePrefix}taxPresence`, INITIAL_BANK_DETAILS_VALUE.taxPresence)
    setFieldValue(`${namePrefix}taxation`, INITIAL_BANK_DETAILS_VALUE.taxation)
  }, [namePrefix, setFieldValue])

  useEffect(() => {
    if (!isCustomFields && isRequisitesFetched) {
      setFieldValue(
        namePrefix + 'bankIdentificationCode',
        currentBank?.bik || INITIAL_BANK_DETAILS_VALUE.bankIdentificationCode,
      )
      setFieldValue(namePrefix + 'correspondentAccount', currentBank?.accountCorrNumber)
      setFieldValue(
        namePrefix + 'bankAccountNumber',
        currentBank?.accounts?.find(a => a === bankAccountNumber),
      )
      setFieldValue(namePrefix + 'inn', currentBroker?.inn, false)
      setFieldValue(namePrefix + 'ogrn', currentBroker?.ogrn, false)
      setFieldValue(namePrefix + 'kpp', currentBroker?.kpp, false)
    }
  }, [
    bankAccountNumber,
    currentBank?.accountCorrNumber,
    currentBank?.accounts,
    currentBank?.bik,
    currentBroker?.inn,
    currentBroker?.kpp,
    currentBroker?.ogrn,
    isCustomFields,
    isRequisitesFetched,
    namePrefix,
    setFieldValue,
  ])

  return { toggleTaxInPercentField, resetInitialValues, clearFieldsForManualEntry }
}
