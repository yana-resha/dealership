import { BrandInfo } from '@sberauto/dictionarydc-proto/public'

import { CAR_BRANDS } from 'shared/api/requests/dictionaryDc.mock'

export const INITIAL_PREPARE_CARS_DATA: Record<string, BrandInfo> = {
  BMW: CAR_BRANDS.BMW,
  Fiat: CAR_BRANDS.Fiat,
}

export const EXPECTED_PREPARE_CARS_DATA = {
  brandMap: {
    BMW: {
      ...CAR_BRANDS.BMW,
      modelInfo: undefined,
      isHasDfoProgram: true,
      isHasGovernmentProgram: true,
      models: ['1 series', '3 series', '5 series'],
      modelMap: CAR_BRANDS.BMW.modelInfo,
    },
    Fiat: {
      ...CAR_BRANDS.Fiat,
      modelInfo: undefined,
      isHasDfoProgram: false,
      isHasGovernmentProgram: false,
      models: ['500', 'Punto', 'Ducato'],
      modelMap: CAR_BRANDS.Fiat.modelInfo,
    },
  },
  brands: ['BMW', 'Fiat'],
}
