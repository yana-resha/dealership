import { useCallback, useEffect, useMemo, useState } from 'react'

import { useFormikContext } from 'formik'
import debounce from 'lodash/debounce'

import { usePrevious } from 'shared/hooks/usePrevious'

import {
  BriefOrderCalculatorFields,
  FormFieldNameMap,
  FullOrderCalculatorFields,
  OrderCalculatorAdditionalService,
} from '../types'

export function getPercentFromValue(valueStr: string, base: number) {
  const value = parseInt(valueStr, 10)
  if (isNaN(value) || isNaN(base)) {
    return ''
  }

  const res = Math.round((value / base) * 10000) / 100

  if (res > 100) {
    return ''
  }

  return `${res}`
}

export function getValueFromPercent(percentStr: string, base: number) {
  const percent = parseInt(percentStr, 10)
  if (isNaN(percent) || isNaN(base)) {
    return ''
  }

  return `${Math.ceil((percent / 100) * base)}`
}
export function useInitialPayment(isDisabledForm: boolean) {
  const { values, setFieldValue, setFieldTouched, touched } = useFormikContext<
    FullOrderCalculatorFields | BriefOrderCalculatorFields
  >()
  const { carCost, initialPayment, initialPaymentPercent, additionalEquipments } = values
  const { initialPayment: isTouchedInitPayment, initialPaymentPercent: isTouchedInitPaymentPercent } = touched

  const prevInitPayment = usePrevious(initialPayment)
  const prevPercent = usePrevious(initialPaymentPercent)
  const [autoChangedInitPayment, setAutoChangedInitPayment] = useState(false)
  const [autoChangedInitPaymentPercent, setAutoChangedInitPaymentPercent] = useState(false)

  const handleInitialPaymentFocus = useCallback(() => setAutoChangedInitPayment(false), [])
  const handleInitialPaymentPercentFocus = useCallback(() => setAutoChangedInitPaymentPercent(false), [])
  const handleInitialPaymentBlur = useCallback(
    () => setFieldTouched(FormFieldNameMap.initialPayment, true),
    [setFieldTouched],
  )
  const handleInitialPaymentPercentBlur = useCallback(
    () => setFieldTouched(FormFieldNameMap.initialPaymentPercent, true),
    [setFieldTouched],
  )

  const creditEquipmentsCost = (additionalEquipments as OrderCalculatorAdditionalService[]).reduce(
    (acc, cur) =>
      !!cur.productType && cur.isCredit && cur.productCost ? acc + parseFloat(cur.productCost || '0') : acc,
    0,
  )
  /* Значение процентов отсчитывается от суммы стоимости автомобиля + сумма тех едениц доп. оборудования,
  которые взяты в кредит. */
  const baseValue = parseInt(carCost, 10) + creditEquipmentsCost
  const prevBaseValue = usePrevious(baseValue)

  const handleInitialPaymentChange = useMemo(
    () =>
      debounce((value: string) => {
        setFieldValue(FormFieldNameMap.initialPaymentPercent, getPercentFromValue(value, baseValue))
        setAutoChangedInitPaymentPercent(true)
      }, 1000),
    [baseValue, setFieldValue],
  )

  const handleInitialPaymentPercentChange = useMemo(
    () =>
      debounce((value: string) => {
        setFieldValue(FormFieldNameMap.initialPayment, getValueFromPercent(value, baseValue))
        setAutoChangedInitPayment(true)
      }, 1000),
    [baseValue, setFieldValue],
  )

  useEffect(() => {
    if (baseValue !== prevBaseValue) {
      handleInitialPaymentChange(initialPayment)
    }
  }, [baseValue, handleInitialPaymentChange, initialPayment, isDisabledForm, prevBaseValue])

  useEffect(() => {
    if (!autoChangedInitPayment && initialPayment !== prevInitPayment) {
      handleInitialPaymentChange(initialPayment)
      setFieldTouched(FormFieldNameMap.initialPayment, true)
    }
  }, [autoChangedInitPayment, handleInitialPaymentChange, initialPayment, prevInitPayment, setFieldTouched])

  useEffect(() => {
    if (!autoChangedInitPaymentPercent && initialPaymentPercent !== prevPercent) {
      handleInitialPaymentPercentChange(initialPaymentPercent)
      setFieldTouched(FormFieldNameMap.initialPaymentPercent, true)
    }
  }, [
    autoChangedInitPaymentPercent,
    handleInitialPaymentPercentChange,
    initialPaymentPercent,
    prevPercent,
    setFieldTouched,
  ])

  useEffect(() => {
    if (isDisabledForm && (isTouchedInitPayment || isTouchedInitPaymentPercent)) {
      setFieldTouched(FormFieldNameMap.initialPayment, false)
      setFieldTouched(FormFieldNameMap.initialPaymentPercent, false)
    }
  }, [isDisabledForm, isTouchedInitPayment, isTouchedInitPaymentPercent, setFieldTouched])

  return {
    handleInitialPaymentFocus,
    handleInitialPaymentPercentFocus,
    handleInitialPaymentBlur,
    handleInitialPaymentPercentBlur,
    // Значения ниже используются только в тестах
    values,
    setFieldValue,
  }
}
