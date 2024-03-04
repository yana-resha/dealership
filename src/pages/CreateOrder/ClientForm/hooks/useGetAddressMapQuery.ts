import { useCallback } from 'react'

import { GetAddressMapResponse } from '@sberauto/dadata-proto/public'
import { useSnackbar } from 'notistack'
import { UseQueryOptions, useQuery } from 'react-query'

import { getAddressMap } from 'shared/api/requests/dadata.api'

import { AddressMap } from '../ClientForm.types'
import { prepareAddressMap } from '../utils/addressMap'

export const useGetAddressMapQuery = (
  options?: UseQueryOptions<GetAddressMapResponse, unknown, AddressMap, string[]>,
) => {
  const { enqueueSnackbar } = useSnackbar()

  const onError = useCallback(
    () => enqueueSnackbar('Не удалось получить коды адресов. Перезагрузите сраницу', { variant: 'error' }),
    [enqueueSnackbar],
  )

  return useQuery(['getAddressMap'], () => getAddressMap({}), {
    onError,
    select: res => prepareAddressMap(res),
    staleTime: Infinity,
    ...options,
  })
}
