import { useCallback } from 'react'

import { GetUserResponse } from '@sberauto/authdc-proto/public'
import { useSnackbar } from 'notistack'
import { useQuery, UseQueryOptions } from 'react-query'
import { useDispatch } from 'react-redux'

import { setUserInfo } from 'entities/user/model/userSlice'
import { checkIsAuthError, CustomFetchError } from 'shared/api/client'
import { getUser } from 'shared/api/requests/authdc'

import { PreparedUser } from '../types'

const prepareUser = (data: GetUserResponse): PreparedUser => {
  const roles = (data.roles || []).reduce((acc, cur) => {
    acc[cur] = true

    return acc
  }, {} as Record<string, boolean>)

  return { ...data, roles }
}

export const useGetUserQuery = (
  options?: UseQueryOptions<GetUserResponse, CustomFetchError, PreparedUser, string[]>,
) => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const onError = useCallback(
    (err: CustomFetchError) => {
      if (!checkIsAuthError(err)) {
        enqueueSnackbar('Не удалось получить информацию о пользователе. Попробуйте перезагрузить страницу', {
          variant: 'error',
        })
      }
    },
    [enqueueSnackbar],
  )

  return useQuery(['getUser'], () => getUser({}), {
    select: data => prepareUser(data),
    onSuccess: data => {
      dispatch(setUserInfo(data))
    },
    onError,
    retry: (_, err) => !checkIsAuthError(err),
    staleTime: Infinity,
    ...options,
  })
}
