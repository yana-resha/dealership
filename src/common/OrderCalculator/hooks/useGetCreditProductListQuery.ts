import { useCallback } from 'react'

import { GetCreditProductListRequest } from '@sberauto/dictionarydc-proto/public'
import { useSnackbar } from 'notistack'
import { useQuery } from 'react-query'

import { getCreditProductList } from 'shared/api/requests/dictionaryDc.api'

import { FullOrderCalculatorFields, OrderCalculatorFields } from '../types'
import { prepareCreditProduct } from '../utils/prepareCreditProductListData'

type Params = {
  vendorCode: string | undefined
  values: OrderCalculatorFields | FullOrderCalculatorFields
  enabled?: boolean
}

export const useGetCreditProductListQuery = ({ vendorCode, values, enabled = true }: Params) => {
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
      ...prepareCreditProduct(res.creditProducts),
    }),
    onError,
    enabled,
  })

  return res
}
