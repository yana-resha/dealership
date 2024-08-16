import { useCallback } from 'react'

import { GetCarsListRequest, GetCarsListResponse } from '@sberauto/dictionarydc-proto/public'
import { useSnackbar } from 'notistack'
import { UseQueryOptions, useQuery } from 'react-query'

import { getCarsList } from 'shared/api/requests/dictionaryDc.api'

import { NormalizedCarsInfo } from '../types'
import { prepareBrands } from '../utils/prepareCars'

export const useGetCarsListQuery = (
  params: GetCarsListRequest,
  options?: UseQueryOptions<NormalizedCarsInfo, unknown, NormalizedCarsInfo, (string | GetCarsListRequest)[]>,
) => {
  const { enqueueSnackbar } = useSnackbar()

  const onError = useCallback(
    () => enqueueSnackbar('Не удалось получить список авто', { variant: 'error' }),
    [enqueueSnackbar],
  )

  return useQuery(
    ['getCarsList', params],
    () =>
      getCarsList(params).then(res => ({
        newCarsInfo: prepareBrands(res.newCars),
        usedCarsInfo: prepareBrands(res.usedCars),
      })),
    {
      retry: false,
      cacheTime: Infinity,
      onError,
      ...options,
    },
  )
}
