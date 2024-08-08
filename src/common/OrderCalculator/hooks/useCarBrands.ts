import { useEffect, useMemo } from 'react'

import { useFormikContext } from 'formik'

import { compareStrings } from 'shared/utils/compareStrings'

import { initialValueMap } from '../config'
import { BriefOrderCalculatorFields, FormFieldNameMap, FullOrderCalculatorFields } from '../types'
import { useCarSection } from './useCarSection'

export function useCarBrands() {
  const { values, setFieldValue } = useFormikContext<BriefOrderCalculatorFields | FullOrderCalculatorFields>()
  const { carBrand, carModel } = values
  const { cars, isLoading, isSuccess, isError } = useCarSection()
  const isCarLoaded = isSuccess && !isLoading
  const isCarError = isError && !isLoading

  const carBrands = useMemo(() => Object.keys(cars).sort(compareStrings), [cars])
  const carModels = useMemo(
    () => (carBrand && cars[carBrand]?.models ? cars[carBrand].models : []).sort(compareStrings),
    [carBrand, cars],
  )

  useEffect(() => {
    if (carBrand && isCarLoaded && !carBrands.includes(carBrand)) {
      setFieldValue(FormFieldNameMap.carBrand, initialValueMap.carBrand)
    }
  }, [carBrand, carBrands, isCarLoaded, setFieldValue])

  useEffect(() => {
    if (carModel && isCarLoaded && !carModels.includes(carModel)) {
      setFieldValue(FormFieldNameMap.carModel, initialValueMap.carModel)
    }
  }, [carModel, carModels, isCarLoaded, setFieldValue])

  return {
    carBrands,
    carModels,
    isDisabledCarModel: !carBrand,
    isCarsLoading: isLoading,
    isCarLoaded,
    isCarError,
  }
}
