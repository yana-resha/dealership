import { useQuery } from 'react-query'

import { getCreditProductList } from 'shared/api/requests/dictionaryDc.api'

import { FullOrderCalculatorFields, OrderCalculatorFields } from '../types'
import { prepareCreditProduct, prepareBankOptions } from '../utils/prepareCreditProductListData'

type Params = {
  vendorCode: string | undefined
  values: OrderCalculatorFields | FullOrderCalculatorFields
  enabled?: boolean
}

export const useGetCreditProductListQuery = ({ vendorCode, values, enabled = true }: Params) =>
  useQuery(
    ['getCreditProductList'],
    () =>
      getCreditProductList({
        vendorCode,
        model: values.carModel || '',
        brand: values.carBrand || '',
        isCarNew: !!values.carCondition,
        autoPrice: parseInt(values.carCost, 10),
        autoCreateYear: values.carYear,
        mileage: parseInt(values.carMileage, 10),
      }),
    {
      retry: false,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      select: res => ({
        ...res,
        ...prepareCreditProduct(res.products),
        ...prepareBankOptions(res.bankOptions),
      }),
      enabled,
    },
  )
