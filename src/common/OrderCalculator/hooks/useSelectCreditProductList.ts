import { useFormikContext } from 'formik'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import { BriefOrderCalculatorFields, FullOrderCalculatorFields } from '../types'
import { useGetCreditProductListQuery } from './useGetCreditProductListQuery'

export function useSelectCreditProductList() {
  const { vendorCode } = getPointOfSaleFromCookies()
  const { values } = useFormikContext<BriefOrderCalculatorFields | FullOrderCalculatorFields>()

  //  enabled: false, т.к. этот хук нужен для просмотра данных, но не для инициализации запросов
  const {
    data: creditProductListData,
    isLoading: isCreditProductListLoading,
    isSuccess: isCreditProductListSuccess,
  } = useGetCreditProductListQuery({ vendorCode, values, enabled: false })

  return { creditProductListData, isCreditProductListLoading, isCreditProductListSuccess }
}
