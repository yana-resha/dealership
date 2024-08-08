import { NormalizedCars } from 'common/OrderCalculator/types'
import { CAR_BRANDS } from 'shared/api/requests/dictionaryDc.mock'

export const mockedUseGetCarsListQueryData: NormalizedCars = {
  newCars: { BMW: CAR_BRANDS.BMW, Fiat: CAR_BRANDS.Fiat },
  usedCars: { KIA: CAR_BRANDS.KIA, Toyota: CAR_BRANDS.Toyota, Skoda: CAR_BRANDS.Skoda },
}
