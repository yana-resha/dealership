import { BankOption, Product } from '@sberauto/dictionarydc-proto/public'

export type RequiredProduct = Omit<Product, 'productCode' | 'productName' | 'downpaymentMin'> &
  Required<Pick<Product, 'productCode' | 'productName'>> & {
    downpaymentMin?: number
  }
export type ProductsMap = Record<string, RequiredProduct>
export const prepearCreditProduct = (initialProducts: Product[] | null | undefined) =>
  initialProducts?.reduce<{ products: RequiredProduct[]; productsMap: ProductsMap }>(
    (acc, cur) => {
      if (!cur.productCode || !cur.productName) {
        return acc
      }
      acc.products.push(cur as RequiredProduct)
      const downpaymentMin = cur.downpaymentMin ? parseInt(cur.downpaymentMin, 10) : undefined
      acc.productsMap[cur.productCode] = { ...cur, downpaymentMin } as RequiredProduct

      return acc
    },
    { products: [], productsMap: {} },
  ) || { products: [], productsMap: {} }

export type RequiredBankOption = BankOption & Required<Pick<BankOption, 'optionCode' | 'optionName'>>
export type BankOptionsMap = Record<string, RequiredBankOption>
export const prepearBankOptions = (initialBankOptions: BankOption[] | null | undefined) =>
  initialBankOptions?.reduce<{
    bankOptions: RequiredBankOption[]
    bankOptionsMap: BankOptionsMap
  }>(
    (acc, cur) => {
      if (!cur.optionCode || !cur.optionName) {
        return acc
      }
      acc.bankOptions.push(cur as RequiredBankOption)
      acc.bankOptionsMap[cur.optionCode] = cur as RequiredBankOption

      return acc
    },
    { bankOptions: [], bankOptionsMap: {} },
  ) || { bankOptions: [], bankOptionsMap: {} }
