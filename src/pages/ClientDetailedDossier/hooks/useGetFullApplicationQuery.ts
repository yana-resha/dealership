import {
  GetFullApplicationRequest,
  GetFullApplicationResponse,
} from '@sberauto/loanapplifecycledc-proto/public'
import { useQuery, UseQueryOptions } from 'react-query'
import { useDispatch } from 'react-redux'

import { setOrder } from 'entities/order'
import { getFullApplication } from 'shared/api/requests/loanAppLifeCycleDc'

export const useGetFullApplicationQuery = (
  params: GetFullApplicationRequest,
  options?: UseQueryOptions<
    GetFullApplicationResponse,
    unknown,
    GetFullApplicationResponse,
    (string | GetFullApplicationRequest)[]
  >,
) => {
  const dispatch = useDispatch()

  return useQuery(['getFullApplication', params], () => getFullApplication(params), {
    retry: false,
    cacheTime: 0,
    onSuccess: response => {
      dispatch(setOrder({ orderData: response }))
    },
    ...options,
  })
}
