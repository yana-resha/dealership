import { BrandInfo, ModelInfo } from '@sberauto/dictionarydc-proto/public'

import { NormalizedBrands, NormalizedModels } from '../types'

type RequiredBrandInfo = BrandInfo & Required<Pick<BrandInfo, 'brand' | 'maxCarAge' | 'modelInfo'>>
type RequiredModelInfo = ModelInfo & Required<Pick<ModelInfo, 'model'>>

const checkBrandInfo = (brandInfo: BrandInfo | null): brandInfo is RequiredBrandInfo =>
  !!brandInfo?.brand && !!brandInfo?.maxCarAge && !!brandInfo?.modelInfo
const checkModelInfo = (modelInfo: ModelInfo | null): modelInfo is RequiredModelInfo => !!modelInfo?.model

export const prepareModels = (initialModelMap: Record<string, ModelInfo | null> | null | undefined) =>
  Object.values(initialModelMap || {}).reduce<
    NormalizedModels & { isHasGovernmentProgram: boolean; isHasDfoProgram: boolean }
  >(
    (acc, cur) => {
      if (!checkModelInfo(cur)) {
        return acc
      }

      if (!acc.isHasGovernmentProgram && cur.govprogramFlag) {
        acc.isHasGovernmentProgram = true
      }
      if (!acc.isHasDfoProgram && cur.govprogramDfoFlag) {
        acc.isHasDfoProgram = true
      }

      acc.modelMap[cur.model] = {
        ...cur,
        govprogramFlag: !!cur.govprogramFlag,
        govprogramDfoFlag: !!cur.govprogramDfoFlag,
      }
      acc.models.push(cur.model)

      return acc
    },
    { models: [], modelMap: {}, isHasGovernmentProgram: false, isHasDfoProgram: false },
  )

export const prepareBrands = (initialBrandMap: Record<string, BrandInfo | null> | null | undefined) =>
  Object.values(initialBrandMap || {}).reduce<NormalizedBrands>(
    (acc, cur) => {
      if (!checkBrandInfo(cur)) {
        return acc
      }
      const { models, modelMap, isHasGovernmentProgram, isHasDfoProgram } = prepareModels(cur.modelInfo)

      if (!models.length) {
        return acc
      }

      acc.brandMap[cur.brand] = {
        ...cur,
        modelInfo: undefined,
        models,
        modelMap,
        isHasGovernmentProgram,
        isHasDfoProgram,
      }
      acc.brands.push(cur.brand)

      return acc
    },
    { brands: [], brandMap: {} },
  )
