import { useCallback } from 'react'

import { GetCarsListRequest, GetCarsListResponse } from '@sberauto/dictionarydc-proto/public'
import { useSnackbar } from 'notistack'
import { UseQueryOptions, useQuery } from 'react-query'

import { getCarsList } from 'shared/api/requests/dictionaryDc.api'

import { NormalizedCar, prepareCars } from '../utils/prepareCars'

type NormalizedCars = {
  newCars: Record<string, NormalizedCar>
  usedCars: Record<string, NormalizedCar>
}

export const useGetCarsListQuery = (
  params: GetCarsListRequest,
  options?: UseQueryOptions<GetCarsListResponse, unknown, NormalizedCars, (string | GetCarsListRequest)[]>,
) => {
  const { enqueueSnackbar } = useSnackbar()

  const onError = useCallback(
    () => enqueueSnackbar('Не удалось получить список авто', { variant: 'error' }),
    [enqueueSnackbar],
  )

  return useQuery(['getCarsList', params], () => getCarsList(params), {
    retry: false,
    cacheTime: Infinity,
    select: res => ({ newCars: prepareCars(res.newCars), usedCars: prepareCars(res.usedCars) }),
    onError,
    ...options,
  })
}
