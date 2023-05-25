import { CarBrand } from '@sberauto/dictionarydc-proto/public'

export const prepareCars = (initialCars: CarBrand[] | null | undefined) => {
  const cars =
    initialCars?.reduce<Record<string, string[]>>((acc, cur) => {
      if (!cur.brand || !cur.models) {
        return acc
      }

      return { ...acc, [cur.brand]: cur.models }
    }, {}) || {}

  return { cars }
}
