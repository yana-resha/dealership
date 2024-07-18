import { useEffect, useMemo } from 'react'

import { useFormikContext } from 'formik'

import { compareStrings } from 'shared/utils/compareStrings'

import { initialValueMap } from '../config'
import { BriefOrderCalculatorFields, FormFieldNameMap, FullOrderCalculatorFields } from '../types'
import { useCarSection } from './useCarSection'

export function useCarBrands() {
  const { values, setFieldValue } = useFormikContext<BriefOrderCalculatorFields | FullOrderCalculatorFields>()
  const { carBrand, carModel } = values
  const { cars } = useCarSection()

  const carBrands = useMemo(() => Object.keys(cars).sort(compareStrings), [cars])
  const carModels = useMemo(
    () => (carBrand && cars[carBrand]?.models ? cars[carBrand].models : []).sort(compareStrings),
    [carBrand, cars],
  )

  useEffect(() => {
    if (carBrand && !carBrands.includes(carBrand)) {
      setFieldValue(FormFieldNameMap.carBrand, initialValueMap.carBrand)
    }
  }, [carBrand, carBrands, setFieldValue])

  useEffect(() => {
    if (carModel && !carModels.includes(carModel)) {
      setFieldValue(FormFieldNameMap.carModel, initialValueMap.carModel)
    }
  }, [carModel, carModels, setFieldValue])

  return { carBrands, carModels, isDisabledCarModel: !carBrand }
}
