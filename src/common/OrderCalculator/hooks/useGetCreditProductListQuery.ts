import { useCallback } from 'react'

import { BankOption, CreditProduct, GetCreditProductListRequest } from '@sberauto/dictionarydc-proto/public'
import { useSnackbar } from 'notistack'
import { UseQueryResult, useQuery } from 'react-query'

import { ProductsMap, RequiredProduct } from 'entities/reduxStore/orderSlice'
import { CustomFetchError } from 'shared/api/client'
import { Service, ServiceApi } from 'shared/api/constants'
import { ErrorAlias, ErrorCode, getErrorMessage } from 'shared/api/errors'
import { getCreditProductList } from 'shared/api/requests/dictionaryDc.api'

import { FullOrderCalculatorFields, BriefOrderCalculatorFields } from '../types'
import { prepareCreditProduct } from '../utils/prepareCreditProductListData'

type Params = {
  vendorCode: number | undefined
  values: BriefOrderCalculatorFields | FullOrderCalculatorFields
  enabled?: boolean
}

export type useGetCreditProductListQueryData = {
  products: RequiredProduct[]
  productsMap: ProductsMap
  fullDownpaymentMin?: number
  fullDownpaymentMax?: number
  fullDurationMin?: number
  fullDurationMax?: number
  creditProducts?: CreditProduct[] | null
  bankOptions?: BankOption[] | null
}

export const useGetCreditProductListQuery = ({
  vendorCode,
  values,
  enabled = true,
}: Params): UseQueryResult<useGetCreditProductListQueryData, unknown> => {
  const { enqueueSnackbar } = useSnackbar()

  const onError = useCallback(
    (err: CustomFetchError) =>
      enqueueSnackbar(
        getErrorMessage({
          service: Service.Dictionarydc,
          serviceApi: ServiceApi.GET_CREDIT_PRODUCT_LIST,
          code: err.code as ErrorCode,
          alias: err.alias as ErrorAlias,
        }),
        { variant: 'error' },
      ),
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
      ...prepareCreditProduct(res.creditProducts),
    }),
    onError,
    enabled,
  })

  return res
}
