import { useCallback, useEffect, useMemo, useState } from 'react'

import { useField, useFormikContext } from 'formik'
import debounce from 'lodash/debounce'

import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'
import { usePrevious } from 'shared/hooks/usePrevious'

import { FormFieldNameMap, OrderCalculatorAdditionalService } from '../types'

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
  const { setFieldValue } = useFormikContext()
  const [carCostField] = useField<string>(FormFieldNameMap.carCost)
  const [additionalEquipments] = useField<OrderCalculatorAdditionalService[]>(
    ServicesGroupName.additionalEquipments,
  )
  const [initPaymentField, { touched: isTouchedInitPayment }, { setTouched: setInitPaymentTouched }] =
    useField<string>(FormFieldNameMap.initialPayment)
  const [
    initPaymentPercentField,
    { touched: isTouchedInitPaymentPercent },
    { setTouched: setInitPaymentPercentTouched },
  ] = useField<string>(FormFieldNameMap.initialPaymentPercent)
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

  const creditEquipmentsCost = additionalEquipments.value.reduce(
    (acc, cur) =>
      cur.productType && cur.isCredit && cur.productCost ? acc + parseInt(cur.productCost, 10) : acc,
    0,
  )
  /* Значение процентов отсчитывается от суммы стоимости автомобиля + сумма тех едениц доп. оборудования,
  которые взяты в кредит. */
  const baseValue = parseInt(carCostField.value, 10) + creditEquipmentsCost
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
    setFieldValue(
      FormFieldNameMap.initialPaymentPercent,
      getPercentFromValue(initPaymentField.value, baseValue),
      false,
    )
  }, [])

  useEffect(() => {
    if (baseValue !== prevBaseValue) {
      handleInitialPaymentChange(initPaymentField.value)
    }
  }, [baseValue, handleInitialPaymentChange, initPaymentField.value, prevBaseValue])

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
