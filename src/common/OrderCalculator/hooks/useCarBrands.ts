import { useEffect, useMemo } from 'react'

import { useField, useFormikContext } from 'formik'

import { usePrevious } from 'shared/hooks/usePrevious'

import { FormFieldNameMap } from '../types'
import { useCarSection } from './useCarSection'

export function useCarBrands() {
  const { setFieldValue } = useFormikContext()
  const { cars } = useCarSection()

  const [carBrandField] = useField<string | null>(FormFieldNameMap.carBrand)
  const prevCarBrandValue = usePrevious(carBrandField.value)
  const carBrands = useMemo(() => Object.keys(cars), [cars])
  const carModels = useMemo(
    () => (carBrandField.value && cars[carBrandField.value]?.models ? cars[carBrandField.value].models : []),
    [carBrandField.value, cars],
  )

  useEffect(() => {
    if (prevCarBrandValue !== carBrandField.value) {
      setFieldValue(FormFieldNameMap.carModel, null)
    }
  }, [carBrandField.value, prevCarBrandValue, setFieldValue])

  return { carBrands, carModels, isDisabledCarModel: !carBrandField.value }
}
