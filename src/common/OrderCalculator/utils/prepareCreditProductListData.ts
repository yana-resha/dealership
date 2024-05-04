import { CreditProduct } from '@sberauto/dictionarydc-proto/public'

import { ProductsMap, RequiredProduct } from 'entities/reduxStore/orderSlice'
import { compareStrings } from 'shared/utils/compareStrings'

export const prepareCreditProduct = (initialProducts: CreditProduct[] | null | undefined) => {
  const { products, productsMap } = initialProducts?.reduce<{
    products: RequiredProduct[]
    productsMap: ProductsMap
  }>(
    (acc, cur) => {
      if (!cur.productId || !cur.productName) {
        return acc
      }

      const product = cur as RequiredProduct

      acc.products.push(product)
      acc.productsMap[cur.productId] = product

      return acc
    },
    { products: [], productsMap: {} },
  ) || { products: [], productsMap: {} }

  return { products: products.sort((a, b) => compareStrings(a.productName, b.productName)), productsMap }
}
