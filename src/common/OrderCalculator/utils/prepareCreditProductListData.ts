import { CreditProduct, Govprograms } from '@sberauto/dictionarydc-proto/public'
import merge from 'lodash/merge'
import union from 'lodash/union'

import {
  GovernmentProgramsMap,
  ProductsMap,
  RequiredGovernmentProgram,
  RequiredProduct,
  RequiredProductCondition,
  RequiredTariff,
} from 'entities/order/model/orderSlice'
import { compareStrings } from 'shared/utils/compareStrings'

const prepareGovernmentPrograms = (
  initialGovernmentPrograms: Govprograms[] | null | undefined,
  governmentProgramsMap: GovernmentProgramsMap,
  productId: string,
) =>
  (initialGovernmentPrograms || []).reduce<{
    productGovernmentProgramsCodes: string[]
    productGovernmentProgramsMap: GovernmentProgramsMap
  }>(
    (acc, cur) => {
      // Поле id нас не интресует, основным является поле code, потому id не проверяем
      const isValidProgram = Object.entries(cur).every(([key, value]) => value !== undefined || key === 'id')
      // если поля программы валидны, то пушим ее массив кодов и мапу
      // в сущность госпрограммы необходимо добавить productId,
      // чтобы понимать какие продукты связаны с этой госпрограмме
      if (isValidProgram) {
        acc.productGovernmentProgramsCodes.push(cur.code as string)
        acc.productGovernmentProgramsMap[cur.code as string] = {
          ...(cur as RequiredGovernmentProgram),
          productIdsForGovernmentProgram: [
            ...(governmentProgramsMap[cur.code as string]?.productIdsForGovernmentProgram || []),
            productId,
          ],
        }
      }

      return acc
    },
    { productGovernmentProgramsCodes: [], productGovernmentProgramsMap: {} },
  )

export const prepareCreditProducts = (initialProducts: CreditProduct[] | null | undefined) => {
  const { productIds, productsMap, governmentProgramsCodes, governmentProgramsMap } = (
    initialProducts || []
  ).reduce<{
    productIds: string[]
    productsMap: ProductsMap
    governmentProgramsCodes: string[]
    governmentProgramsMap: GovernmentProgramsMap
  }>(
    (acc, cur) => {
      if (!cur.productId || !cur.productName) {
        return acc
      }

      const conditions = [...(cur.conditions || [])].reduce((acc, cur) => {
        const tariffs = (cur.rateMod?.tariffs || [])
          .map(tariff => ({ ...tariff, rateDelta: tariff.rateDelta ?? 0 }))
          .filter((tariff): tariff is RequiredTariff => !!tariff.tariffId)

        // Считаем объект rateMod вылидным если он содержит optionId и tariffs с вылидными значениями,
        // либо если requiredService=false
        const isValidRateMod =
          (cur.rateMod?.optionId && tariffs.length) || !cur.rateMod || cur.rateMod.requiredService === false

        // добавляем condition с валидным rateMod
        if (isValidRateMod) {
          acc.push({
            ...cur,
            rateMod: cur.rateMod
              ? {
                  optionId: cur.rateMod.optionId as string,
                  tariffs,
                  requiredService: cur.rateMod.requiredService ?? true,
                }
              : undefined,
          })
        }

        return acc
      }, [] as RequiredProductCondition[])

      // Если есть хотя бы один condition, то добавляем product в мапу и массив (id продукта)
      if (conditions.length) {
        /* Перед добавлением продукта, мапим госпрограммы в нем. Т.к. программу нужно выбрать первой,
        а потом по ней отфильтровать продукты, то выносим программы в общий массив и мапу из продуктов,
        и в каждой программе оставляем массив id продуктов, с которыми она связана.
        В программы в продуктах могут попадаться одинаковые. */
        const { productGovernmentProgramsCodes, productGovernmentProgramsMap } = prepareGovernmentPrograms(
          cur.govPrograms,
          acc.governmentProgramsMap,
          cur.productId,
        )
        acc.governmentProgramsCodes = union(acc.governmentProgramsCodes, productGovernmentProgramsCodes)
        acc.governmentProgramsMap = merge(acc.governmentProgramsMap, productGovernmentProgramsMap)
        // govPrograms больше не нужен,
        // т.к. теперь в родителе есть governmentProgramsCodes и governmentProgramsMap
        const product = { ...cur, conditions, govPrograms: null } as RequiredProduct
        acc.productIds.push(product.productId)
        acc.productsMap[cur.productId] = product
      }

      return acc
    },
    {
      productIds: [],
      productsMap: {},
      governmentProgramsCodes: [],
      governmentProgramsMap: {},
    },
  )

  return {
    productIds: productIds.sort((a, b) =>
      compareStrings(productsMap[a].productName, productsMap[b].productName),
    ),
    productsMap,
    governmentProgramsCodes: governmentProgramsCodes.sort((a, b) =>
      compareStrings(governmentProgramsMap[a].name, governmentProgramsMap[b].name),
    ),
    governmentProgramsMap,
  }
}
