import { useEffect, useMemo } from 'react'

import { useField, useFormikContext } from 'formik'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { usePrevious } from 'shared/hooks/usePrevious'

import { FormFieldNameMap } from '../types'
import { useGetCarsListQuery } from './useGetCarsListQuery'

export function useCarBrands() {
  const { setFieldValue } = useFormikContext()
  const { vendorCode } = getPointOfSaleFromCookies()
  const { data } = useGetCarsListQuery({ vendorCode })

  const [carBrandField] = useField(FormFieldNameMap.carBrand)
  const prevCarBrandValue = usePrevious(carBrandField.value)
  const carBrands = useMemo(() => Object.keys(data?.cars || {}), [data?.cars])
  const carModels = useMemo(() => data?.cars?.[carBrandField.value] || [], [carBrandField.value, data?.cars])

  useEffect(() => {
    if (prevCarBrandValue !== carBrandField.value) {
      setFieldValue(FormFieldNameMap.carModel, null)
    }
  }, [carBrandField.value, prevCarBrandValue, setFieldValue])

  return { carBrands, carModels, isDisabledCarModel: !carBrandField.value }
}
