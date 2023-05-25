import { useQuery } from 'react-query'

import { fetchGetCreditProductList } from 'shared/api/dictionaryDc/dictionaryDc.api'

import { OrderCalculatorFields } from '../config'
import { prepearCreditProduct, prepearBankOptions } from '../utils/prepearCreditProductListData'

type Params = {
  vendorCode: string | undefined
  values: OrderCalculatorFields
  enabled?: boolean
}

export const useGetCreditProductListQuery = ({ vendorCode, values, enabled = true }: Params) =>
  useQuery(
    ['getCreditProductList'],
    () =>
      fetchGetCreditProductList({
        vendorCode,
        model: values.carModel || '',
        brand: values.carBrand || '',
        isCarNew: !!values.carCondition,
        autoPrice: parseInt(values.carCost, 10),
        autoCreateYear: parseInt(values.carYear, 10),
        mileage: parseInt(values.carMileage, 10),
      }),
    {
      retry: false,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      select: res => ({
        ...res,
        ...prepearCreditProduct(res.products),
        ...prepearBankOptions(res.bankOptions),
      }),
      enabled,
    },
  )
