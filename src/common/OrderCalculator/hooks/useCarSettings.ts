import { useCallback, useEffect, useMemo, useState } from 'react'

import { useFormikContext } from 'formik'

import { FormFieldNameMap } from '../types'

const CREDIT_PRODUCT_PARAMS_FIELDS = [
  FormFieldNameMap.carCondition,
  FormFieldNameMap.carBrand,
  FormFieldNameMap.carModel,
  FormFieldNameMap.carYear,
  FormFieldNameMap.carCost,
  FormFieldNameMap.carMileage,
]

export function useCarSettings(onFilled: () => void, fetchProducts: () => void) {
  const { errors, setFieldTouched } = useFormikContext()

  const [shouldChangeFillStatus, setShouldChangeFillStatus] = useState(false)
  const [isFilled, setFilled] = useState(false)
  const hasErrors = useMemo(
    () => Object.keys(errors).some(k => CREDIT_PRODUCT_PARAMS_FIELDS.includes(k as FormFieldNameMap)),
    [errors],
  )

  const handleBtnClick = useCallback(() => {
    CREDIT_PRODUCT_PARAMS_FIELDS.forEach(f => setFieldTouched(f, true))
    setShouldChangeFillStatus(true)
    fetchProducts()
  }, [setFieldTouched])

  useEffect(() => {
    if (!isFilled) {
      return
    }
    if (!hasErrors) {
      onFilled()
    }
    setFilled(false)
  }, [hasErrors, isFilled, onFilled])

  useEffect(() => {
    if (shouldChangeFillStatus) {
      setFilled(true)
      setShouldChangeFillStatus(false)
    }
  }, [shouldChangeFillStatus])

  return { handleBtnClick }
}
