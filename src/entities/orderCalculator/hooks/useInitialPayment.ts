import { useEffect, useMemo, useState } from 'react'

import { useField, useFormikContext } from 'formik'
import debounce from 'lodash/debounce'

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

export function useInitialPayment(carCostName: string, initialPaymentName: string) {
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
