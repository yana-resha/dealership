import { CreditProduct } from '@sberauto/dictionarydc-proto/public'

import {
  ProductsMap,
  RequiredProduct,
  RequiredProductCondition,
  RequiredRateMods,
} from 'entities/reduxStore/orderSlice'
import { compareStrings } from 'shared/utils/compareStrings'

export const prepareCreditProducts = (initialProducts: CreditProduct[] | null | undefined) => {
  const { products, productsMap } = (initialProducts || []).reduce<{
    products: RequiredProduct[]
    productsMap: ProductsMap
  }>(
    (acc, cur) => {
      if (!cur.productId || !cur.productName) {
        return acc
      }

      const conditions = (cur.conditions || []).reduce((acc, cur) => {
        /* отфильтровываем rateMod, у которых нет optionId или tariffId, если при этом requiredService=false,
        если же при этом requiredService=true, то считаем весь массив rateMods невалилным,
        останавливаем reduce и присваиваем isValidRateMods=false */
        const { rateMods, isValidRateMods } = [...(cur.rateMods || [])].reduce(
          (rateModsAcc, currentRateMod, rateModsIdx, rateModsArr) => {
            const isValidRateMod = !!currentRateMod.optionId && !!currentRateMod.tariffId
            const requiredService = currentRateMod.requiredService ?? true
            if (isValidRateMod) {
              rateModsAcc.rateMods.push(currentRateMod as RequiredRateMods)
            }
            if (!isValidRateMod && requiredService) {
              rateModsAcc.isValidRateMods = false
              rateModsArr.splice(1)
            }

            return rateModsAcc
          },
          {
            rateMods: [] as RequiredRateMods[],
            isValidRateMods: true,
          } as { rateMods: RequiredRateMods[]; isValidRateMods: boolean },
        )

        // добавляем condition с отфильтрованными rateMods, если isValidRateMods=true
        if (isValidRateMods) {
          acc.push({ ...cur, rateMods })
        }

        return acc
      }, [] as RequiredProductCondition[])

      // Если есть хотя бы один condition, то добавляем product
      if (conditions.length) {
        const product = { ...cur, conditions } as RequiredProduct
        acc.products.push(product)
        acc.productsMap[cur.productId] = product
      }

      return acc
    },
    { products: [], productsMap: {} },
  )

  return { products: products.sort((a, b) => compareStrings(a.productName, b.productName)), productsMap }
}
