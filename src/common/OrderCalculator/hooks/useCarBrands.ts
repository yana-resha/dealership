import { useEffect, useMemo } from 'react'

import { useFormikContext } from 'formik'

import { compareStrings } from 'shared/utils/compareStrings'

import { initialValueMap } from '../config'
import { BriefOrderCalculatorFields, FormFieldNameMap } from '../types'
import { useCarSection } from './useCarSection'

const checkIsHasGovernmentProgram = (
  isFormHasGovernmentProgram: boolean,
  isFormHasDfoProgram: boolean,
  isCarHasGovernmentProgram: boolean,
  isCarHasDfoProgram: boolean,
) => {
  if (isFormHasGovernmentProgram && isFormHasDfoProgram) {
    return isCarHasGovernmentProgram && isCarHasDfoProgram
  }
  if (isFormHasGovernmentProgram) {
    return isCarHasGovernmentProgram
  }

  return true
}

export function useCarBrands() {
  const { values, setFieldValue } = useFormikContext<BriefOrderCalculatorFields>()
  const { isGovernmentProgram, isDfoProgram, carBrand, carModel } = values

  const { data: carsInfo, isLoading, isSuccess, isError } = useCarSection()

  const isCarLoaded = isSuccess && !isLoading
  const isCarError = isError && !isLoading

  const carBrands = useMemo(
    () =>
      carsInfo.brands
        .filter(brand => {
          const { isHasGovernmentProgram, isHasDfoProgram } = carsInfo.brandMap[brand]

          return checkIsHasGovernmentProgram(
            isGovernmentProgram,
            isDfoProgram,
            isHasGovernmentProgram,
            isHasDfoProgram,
          )
        })
        .sort(compareStrings),
    [carsInfo, isDfoProgram, isGovernmentProgram],
  )

  const carModels = useMemo(
    () =>
      (carsInfo.brandMap[carBrand || '']?.models || [])
        .filter(modelKey => {
          const model = carsInfo.brandMap[carBrand || ''].modelMap[modelKey]
          const { govprogramFlag, govprogramDfoFlag } = model

          return checkIsHasGovernmentProgram(
            isGovernmentProgram,
            isDfoProgram,
            govprogramFlag,
            govprogramDfoFlag,
          )
        })
        .sort(compareStrings),
    [carBrand, carsInfo.brandMap, isDfoProgram, isGovernmentProgram],
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
