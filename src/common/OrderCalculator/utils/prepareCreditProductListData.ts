import { BankOption, CreditProduct } from '@sberauto/dictionarydc-proto/public'

export type RequiredProduct = Omit<CreditProduct, 'productCode' | 'productName' | 'downpaymentMin'> &
  Required<Pick<CreditProduct, 'productCode' | 'productName'>> & {
    downpaymentMin?: number
  }

export type ProductsMap = Record<string, RequiredProduct>

export const prepareCreditProduct = (initialProducts: CreditProduct[] | null | undefined) =>
  initialProducts?.reduce<{ products: RequiredProduct[]; productsMap: ProductsMap }>(
    (acc, cur) => {
      if (!cur.productCode || !cur.productName) {
        return acc
      }
      acc.products.push(cur as RequiredProduct)

      const downpaymentMin = cur.downpaymentMin ? parseInt(`${cur.downpaymentMin}`, 10) : undefined
      acc.productsMap[cur.productCode] = { ...cur, downpaymentMin } as RequiredProduct

      return acc
    },
    { products: [], productsMap: {} },
  ) || { products: [], productsMap: {} }
