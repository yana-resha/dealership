import { CreditProduct } from '@sberauto/dictionarydc-proto/public'

import { compareStrings } from 'shared/utils/compareStrings'

export type RequiredProduct = Omit<CreditProduct, 'productId' | 'productName'> &
  Required<Pick<CreditProduct, 'productId' | 'productName'>>

export type ProductsMap = Record<string, RequiredProduct>

export const prepareCreditProduct = (initialProducts: CreditProduct[] | null | undefined) => {
  const { products, productsMap } = initialProducts?.reduce<{
    products: RequiredProduct[]
    productsMap: ProductsMap
  }>(
    (acc, cur) => {
      if (!cur.productId || !cur.productName) {
        return acc
      }
      acc.products.push(cur as RequiredProduct)
      // С Бэка значение приходит в диапазоне 0...1, а на фронте используются проценты (0...100)
      const downpaymentMin = cur.downpaymentMin ? cur.downpaymentMin * 100 : undefined
      const downpaymentMax = cur.downpaymentMax ? cur.downpaymentMax * 100 : undefined
      acc.productsMap[cur.productId] = { ...cur, downpaymentMin, downpaymentMax } as RequiredProduct

      return acc
    },
    { products: [], productsMap: {} },
  ) || { products: [], productsMap: {} }

  return { products: products.sort((a, b) => compareStrings(a.productName, b.productName)), productsMap }
}
