import { useCallback, useEffect, useRef } from 'react'

import { useFormikContext } from 'formik'

import {
  FullInitialAdditionalEquipments,
  FullInitialAdditionalService,
  FullOrderCalculatorFields,
} from 'common/OrderCalculator/types'

import { FULL_INITIAL_ADDITIONAL_EQUIPMENTS } from '../../../../common/OrderCalculator/config'
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
      setFieldValue(`${namePrefix}taxation`, value ? FULL_INITIAL_ADDITIONAL_EQUIPMENTS.taxation : '0')
    },
    [namePrefix, setFieldValue],
  )

  const resetInitialValues = useCallback(() => {
    setFieldValue(`${namePrefix}beneficiaryBank`, FULL_INITIAL_ADDITIONAL_EQUIPMENTS.beneficiaryBank)
    setFieldValue(`${namePrefix}taxPresence`, initialValues.current.taxPresence)
    setFieldValue(`${namePrefix}taxation`, initialValues.current.taxation)
  }, [namePrefix, setFieldValue])

  const clearFieldsForManualEntry = useCallback(() => {
    setFieldValue(`${namePrefix}beneficiaryBank`, FULL_INITIAL_ADDITIONAL_EQUIPMENTS.beneficiaryBank)
    setFieldValue(`${namePrefix}bankAccountNumber`, FULL_INITIAL_ADDITIONAL_EQUIPMENTS.bankAccountNumber)
    setFieldValue(
      `${namePrefix}bankIdentificationCode`,
      FULL_INITIAL_ADDITIONAL_EQUIPMENTS.bankIdentificationCode,
    )
    setFieldValue(
      `${namePrefix}correspondentAccount`,
      FULL_INITIAL_ADDITIONAL_EQUIPMENTS.correspondentAccount,
    )
    setFieldValue(`${namePrefix}taxPresence`, FULL_INITIAL_ADDITIONAL_EQUIPMENTS.taxPresence)
    setFieldValue(`${namePrefix}taxation`, FULL_INITIAL_ADDITIONAL_EQUIPMENTS.taxation)
  }, [namePrefix, setFieldValue])

  useEffect(() => {
    if (!isCustomFields && isRequisitesFetched) {
      setFieldValue(namePrefix + 'bankIdentificationCode', currentBank?.bik)
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
