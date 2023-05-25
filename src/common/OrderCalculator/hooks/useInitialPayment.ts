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

export function useInitialPayment(
  carCostName: string,
  initPaymentName: string,
  initPaymentPercentName: string,
  isDisabledForm: boolean,
) {
  const { setFieldValue } = useFormikContext()
  const [carCostField] = useField(carCostName)
  const [initPaymentField, { touched: isTouchedInitPayment }, { setTouched: setInitPaymentTouched }] =
    useField(initPaymentName)
  const [
    initPaymentPercentField,
    { touched: isTouchedInitPaymentPercent },
    { setTouched: setInitPaymentPercentTouched },
  ] = useField(initPaymentPercentName)
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
      setInitPaymentTouched(true)
    }
  }, [
    autoChangedInitPayment,
    handleInitialPaymentChange,
    initPaymentField.value,
    prevInitPayment,
    setInitPaymentTouched,
  ])

  useEffect(() => {
    if (!autoChangedInitPaymentPercent && initPaymentPercentField.value !== prevPercent) {
      handleInitialPaymentPercentChange(initPaymentPercentField.value)
      setInitPaymentPercentTouched(true)
    }
  }, [
    autoChangedInitPaymentPercent,
    handleInitialPaymentPercentChange,
    initPaymentPercentField.value,
    prevPercent,
    setInitPaymentPercentTouched,
  ])

  useEffect(() => {
    if (isDisabledForm && (isTouchedInitPayment || isTouchedInitPaymentPercent)) {
      setInitPaymentTouched(false)
      setInitPaymentPercentTouched(false)
    }
  }, [
    isDisabledForm,
    isTouchedInitPayment,
    isTouchedInitPaymentPercent,
    setInitPaymentPercentTouched,
    setInitPaymentTouched,
  ])

  return {
    handleInitialPaymentFocus,
    handleInitialPaymentPercentFocus,
    handleInitialPaymentBlur,
    handleInitialPaymentPercentBlur,
  }
}
