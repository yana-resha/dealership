import { useFindApplicationsQuery } from 'common/findApplication/FindApplication/FindApplication.api'

import { OrderData } from '../OrderForm/OrderForm.types'

export function useFindApplications(shouldDataFetch: boolean, initialOrderData: OrderData | undefined) {
  const { data, isSuccess, isError } = useFindApplicationsQuery(
    { ...initialOrderData },
    { skip: !shouldDataFetch || !initialOrderData },
  )

  return {
    isSuccessFindApplicationsQuery: isSuccess,
    isErrorFindApplicationsQuery: isError,
    orderData: data,
  }
}
