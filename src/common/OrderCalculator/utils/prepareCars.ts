import { Car } from '@sberauto/dictionarydc-proto/public'

import { NormalizedCar } from '../types'

export const prepareCars = (initialCars: Car[] | null | undefined) =>
  initialCars?.reduce<Record<string, NormalizedCar>>((acc, cur) => {
    if (!cur.brand || !cur.models || !cur.maxCarAge) {
      return acc
    }

    return { ...acc, [cur.brand]: cur as NormalizedCar }
  }, {}) || {}
