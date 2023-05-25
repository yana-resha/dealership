import { useCallback, useEffect, useMemo, useState } from 'react'

import { useField, useFormikContext } from 'formik'
import debounce from 'lodash/debounce'

import { usePrevious } from 'shared/hooks/usePrevious'

export function getPercentFromValue(valueStr: string, baseStr: string) {
  const value = parseFloat(valueStr)
  const base = parseFloat(baseStr)
  if (isNaN(value) || isNaN(base)) {
    return ''
  }

  const res = Math.round((value / base) * 10000) / 100

  if (res > 100) {
    return ''
  }

  return `${res}`
}

export function getValueFromPercent(percentStr: string, baseStr: string) {
  const percent = parseFloat(percentStr)
  const base = parseFloat(baseStr)
  if (isNaN(percent) || isNaN(base)) {
    return ''
  }

  return `${Math.round((percent / 100) * base)}`
}
// TODO DCB-272 удалить этот хук, большой калькулятор перевести на useInitialPayment
export function useInitialPaymentFullCalc(carCostName: string, initialPaymentName: string) {
  const { setFieldValue } = useFormikContext()
  const [carCostField] = useField(carCostName)
  const [initialPaymentField] = useField(initialPaymentName)
  const [initialPaymentPercent, setInitialPaymentPercent] = useState(
    getPercentFromValue(initialPaymentField.value, carCostField.value),
  )

  const handleInitialPaymentPercentChange = useMemo(
    () =>
      debounce((val: string) => {
        setInitialPaymentPercent(val)
        setFieldValue(initialPaymentName, getValueFromPercent(val, carCostField.value))
      }, 1500),
    [carCostField.value, initialPaymentName, setFieldValue],
  )

  useEffect(() => {
    setInitialPaymentPercent(getPercentFromValue(initialPaymentField.value, carCostField.value))
  }, [carCostField.value, initialPaymentField.value])

  return { initialPaymentPercent, handleInitialPaymentPercentChange }
}

export function useInitialPayment(
  carCostName: string,
  initPaymentName: string,
  initPaymentPercentName: string,
  isDisabledForm: boolean,
) {
  const { setFieldValue } = useFormikContext()
  const [carCostField] = useField(carCostName)
  const [initPaymentField, , { setTouched: setInitPaymentTouched }] = useField(initPaymentName)
  const [initPaymentPercentField, , { setTouched: setInitPaymentPercentTouched }] =
    useField(initPaymentPercentName)
  const prevInitPayment = usePrevious(initPaymentField.value)
  const prevPercent = usePrevious(initPaymentPercentField.value)
  const [autoChangedInitPayment, setAutoChangedInitPayment] = useState(false)
  const [autoChangedInitPaymentPercent, setAutoChangedInitPaymentPercent] = useState(false)

  const handleInitialPaymentFocus = useCallback(() => setAutoChangedInitPayment(false), [])
  const handleInitialPaymentPercentFocus = useCallback(() => setAutoChangedInitPaymentPercent(false), [])
  const handleInitialPaymentBlur = useCallback(() => setInitPaymentTouched(true), [setInitPaymentTouched])
  const handleInitialPaymentPercentBlur = useCallback(
    () => setInitPaymentPercentTouched(true),
    [setInitPaymentPercentTouched],
  )

  const handleInitialPaymentChange = useMemo(
    () =>
      debounce((value: string) => {
        setFieldValue(initPaymentPercentName, getPercentFromValue(value, carCostField.value))
        setAutoChangedInitPaymentPercent(true)
      }, 1000),
    [carCostField.value, initPaymentPercentName, setFieldValue],
  )

  const handleInitialPaymentPercentChange = useMemo(
    () =>
      debounce((value: string) => {
        setFieldValue(initPaymentName, getValueFromPercent(value, carCostField.value))
        setAutoChangedInitPayment(true)
      }, 1000),
    [carCostField.value, initPaymentName, setFieldValue],
  )

  useEffect(() => {
    if (!autoChangedInitPayment && initPaymentField.value !== prevInitPayment) {
      handleInitialPaymentChange(initPaymentField.value)
    }
  }, [initPaymentField.value])

  useEffect(() => {
    if (!autoChangedInitPaymentPercent && initPaymentPercentField.value !== prevPercent) {
      handleInitialPaymentPercentChange(initPaymentPercentField.value)
      setInitPaymentPercentTouched(true)
    }
  }, [initPaymentPercentField.value])

  useEffect(() => {
    if (isDisabledForm) {
      setInitPaymentTouched(false)
      setInitPaymentPercentTouched(false)
    }
  }, [isDisabledForm])

  return {
    handleInitialPaymentFocus,
    handleInitialPaymentPercentFocus,
    handleInitialPaymentBlur,
    handleInitialPaymentPercentBlur,
  }
}
