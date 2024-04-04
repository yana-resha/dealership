import { BankOption, CreditProduct } from '@sberauto/dictionarydc-proto/public'

import { ProductsMap, RequiredProduct } from 'common/OrderCalculator/utils/prepareCreditProductListData'

const products = [
  {
    productCode: 10,
    productCodeName: 'ACDC',
    productName: 'Максимум: Без Каско',
    productId: 'ACDC',
    downpaymentMin: 20,
    downpaymentMax: 80,
    durationMin: 24,
    durationMax: 84,
    npllzp: 16000000,
    npllzak: 16000000,
    termsLoanCode: 269,
    approvalValidity: 45,
    baseRate: 0.159,
    baseRateNew: 0.159,
    baseRateOld: 0.159,
    rateGrntyPeriod: 0,
    rateNewGrnty: 0,
    rateNonGrnty: 0,
    rateDiscountCpi: 0,
    cascoFlag: true,
    incomeFlag: true,
    ratePenaltyCasco: 0,
    activeDateFrom: '2023-01-01',
    activeDateTo: '2099-01-01',
    crMinValue: 100000,
    crMaxValue: 6000000,
  },
  {
    productCode: 10,
    productCodeName: 'AKHC',
    productName: 'Комфорт: Драйв',
    productId: 'AKHC',
    downpaymentMin: 0,
    downpaymentMax: 90,
    durationMin: 36,
    durationMax: 72,
    npllzp: 16000000,
    npllzak: 16000000,
    termsLoanCode: 269,
    approvalValidity: 45,
    baseRate: 0.167,
    baseRateNew: 0.167,
    baseRateOld: 0.167,
    rateGrntyPeriod: 0,
    rateNewGrnty: 0,
    rateNonGrnty: 0,
    rateDiscountCpi: 0,
    cascoFlag: true,
    incomeFlag: true,
    ratePenaltyCasco: 0.02,
    activeDateFrom: '2023-01-01',
    activeDateTo: '2099-01-01',
    crMinValue: 100000,
    crMaxValue: 16000000,
  },
]

export const mockedUseGetCreditProductListQueryResponseData: {
  products: RequiredProduct[]
  productsMap: ProductsMap
  fullDownpaymentMin: number | undefined
  fullDownpaymentMax: number | undefined
  fullDurationMin?: number | undefined
  fullDurationMax?: number | undefined
  creditProducts?: CreditProduct[] | null | undefined
  bankOptions?: BankOption[] | null | undefined
} = {
  fullDownpaymentMin: 0,
  fullDownpaymentMax: 90,
  fullDurationMin: 24,
  fullDurationMax: 84,
  products: products,

  productsMap: {
    ACDC: products[0],
    AKHC: products[1],
  },
}
