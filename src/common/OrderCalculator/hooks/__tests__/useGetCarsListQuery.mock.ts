import { NormalizedCarsInfo } from 'common/OrderCalculator/types'
import { CAR_BRANDS } from 'shared/api/requests/dictionaryDc.mock'

export const mockedUseGetCarsListQueryData: NormalizedCarsInfo = {
  newCarsInfo: {
    brandMap: {
      BMW: {
        ...CAR_BRANDS.BMW,
        isHasDfoProgram: true,
        isHasGovernmentProgram: true,
        models: ['1 series', '3 series', '5 series'],
        modelMap: CAR_BRANDS.BMW.modelInfo,
      },
      Fiat: {
        ...CAR_BRANDS.Fiat,
        isHasDfoProgram: true,
        isHasGovernmentProgram: true,
        models: ['Punto', '500', 'Ducato'],
        modelMap: CAR_BRANDS.Fiat.modelInfo,
      },
    },
    brands: ['BMW', 'Fiat'],
  },
  usedCarsInfo: {
    brandMap: {
      KIA: {
        ...CAR_BRANDS.KIA,
        isHasDfoProgram: true,
        isHasGovernmentProgram: true,
        models: ['Picanto', 'Rio', 'Ceed'],
        modelMap: CAR_BRANDS.KIA.modelInfo,
      },
      Toyota: {
        ...CAR_BRANDS.Toyota,
        isHasDfoProgram: true,
        isHasGovernmentProgram: true,
        models: ['Camry', 'Corolla'],
        modelMap: CAR_BRANDS.Toyota.modelInfo,
      },
      Skoda: {
        ...CAR_BRANDS.Skoda,
        isHasDfoProgram: true,
        isHasGovernmentProgram: true,
        models: ['Rapid', 'Octavia', 'Superb'],
        modelMap: CAR_BRANDS.Toyota.modelInfo,
      },
    },
    brands: ['KIA'],
  },
}
