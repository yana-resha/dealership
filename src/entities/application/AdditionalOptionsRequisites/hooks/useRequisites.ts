import { useCallback, useEffect, useRef } from 'react'

import { useFormikContext } from 'formik'

import {
  FullInitialAdditionalEquipments,
  FullInitialAdditionalService,
  FullOrderCalculatorFields,
} from 'common/OrderCalculator/types'

import { RequiredRequisite } from './useRequisitesForFinancingQuery'

type Params = {
  namePrefix: string
  values: FullOrderCalculatorFields | FullInitialAdditionalEquipments | FullInitialAdditionalService
  currentBank: RequiredRequisite | undefined
  isCustomFields: boolean
  isRequisitesFetched: boolean
}
export function useRequisites({
  namePrefix,
  values,
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
      setFieldValue(`${namePrefix}taxation`, value ? '' : '0')
    },
    [namePrefix, setFieldValue],
  )

  const resetInitialValues = useCallback(() => {
    setFieldValue(`${namePrefix}beneficiaryBank`, '')
    setFieldValue(`${namePrefix}taxPresence`, initialValues.current.taxPresence)
    setFieldValue(`${namePrefix}taxation`, initialValues.current.taxation)
  }, [namePrefix, setFieldValue])

  const clearFieldsForManualEntry = useCallback(() => {
    setFieldValue(`${namePrefix}beneficiaryBank`, '')
    setFieldValue(`${namePrefix}bankAccountNumber`, '')
    setFieldValue(`${namePrefix}bankIdentificationCode`, '')
    setFieldValue(`${namePrefix}correspondentAccount`, '')
    setFieldValue(`${namePrefix}taxPresence`, false)
    setFieldValue(`${namePrefix}taxation`, '0')
  }, [namePrefix, setFieldValue])

  useEffect(() => {
    if (!isCustomFields && isRequisitesFetched) {
      setFieldValue(namePrefix + 'bankIdentificationCode', currentBank?.bik || '')
      setFieldValue(namePrefix + 'correspondentAccount', currentBank?.accountCorrNumber || '')
      setFieldValue(
        namePrefix + 'bankAccountNumber',
        currentBank?.accounts?.find(a => a === bankAccountNumber) || '',
      )
      setFieldValue(namePrefix + 'inn', currentBank?.inn || '', false)
      setFieldValue(namePrefix + 'ogrn', currentBank?.ogrn || '', false)
      setFieldValue(namePrefix + 'kpp', currentBank?.kpp || '', false)
    }
  }, [
    bankAccountNumber,
    currentBank?.accountCorrNumber,
    currentBank?.accounts,
    currentBank?.bik,
    currentBank?.inn,
    currentBank?.kpp,
    currentBank?.ogrn,
    isCustomFields,
    isRequisitesFetched,
    namePrefix,
    setFieldValue,
  ])

  return { toggleTaxInPercentField, resetInitialValues, clearFieldsForManualEntry }
}
