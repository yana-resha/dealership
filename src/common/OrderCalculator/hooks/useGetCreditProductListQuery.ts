import { useCallback } from 'react'

import { BankOption, CreditProduct, GetCreditProductListRequest } from '@sberauto/dictionarydc-proto/public'
import { useSnackbar } from 'notistack'
import { UseQueryResult, useQuery } from 'react-query'

import { getCreditProductList } from 'shared/api/requests/dictionaryDc.api'

import { FullOrderCalculatorFields, BriefOrderCalculatorFields } from '../types'
import { ProductsMap, RequiredProduct, prepareCreditProduct } from '../utils/prepareCreditProductListData'

type Params = {
  vendorCode: string | undefined
  values: BriefOrderCalculatorFields | FullOrderCalculatorFields
  enabled?: boolean
}

export type useGetCreditProductListQueryData = {
  products: RequiredProduct[]
  productsMap: ProductsMap
  fullDownpaymentMin: number | undefined
  fullDownpaymentMax: number | undefined
  fullDurationMin?: number | undefined
  fullDurationMax?: number | undefined
  creditProducts?: CreditProduct[] | null | undefined
  bankOptions?: BankOption[] | null | undefined
}

export const useGetCreditProductListQuery = ({
  vendorCode,
  values,
  enabled = true,
}: Params): UseQueryResult<useGetCreditProductListQueryData, unknown> => {
  const { enqueueSnackbar } = useSnackbar()

  const onError = useCallback(
    () => enqueueSnackbar('Не удалось получить список кредитных продуктов', { variant: 'error' }),
    [enqueueSnackbar],
  )

  const params: GetCreditProductListRequest = {
    vendorCode,
    model: values?.carModel || '',
    brand: values?.carBrand || '',
    isCarNew: !!values?.carCondition,
    autoCreateYear: values?.carYear,
  }

  const res = useQuery(['getCreditProductList', params], () => getCreditProductList(params), {
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    select: res => ({
      ...res,
      // С Бэка значение приходит в диапазоне 0...1, а на фронте используются проценты (0...100)
      fullDownpaymentMin: res.fullDownpaymentMin ? res.fullDownpaymentMin * 100 : undefined,
      fullDownpaymentMax: res.fullDownpaymentMax ? res.fullDownpaymentMax * 100 : undefined,
      ...prepareCreditProduct(res.creditProducts),
    }),
    onError,
    enabled,
  })

  return res
}
