import { createAuthDc, GetTokenRequest, GetUserRequest } from '@sberauto/authdc-proto/public'
import { useQuery } from 'react-query'

import { appConfig } from 'config'

import { Rest } from '../client'
import { authToken } from '../token'

const authDcApi = createAuthDc(`${appConfig.apiUrl}/authdc`, Rest.request)

export const getToken = (params: GetTokenRequest) =>
  authDcApi.getToken({ data: params }).then(response => response.data ?? {})

export const getUser = (params: GetUserRequest) =>
  authDcApi.getUser({ data: params }).then(response => response.data ?? {})

export const refreshAuthByToken = () =>
  authDcApi
    .refreshAuthByToken({ data: { refreshToken: authToken.refresh.get() ?? undefined } })
    .then(response => {
      if (!response.data.accessJwt || !response.data.refreshToken) {
        throw new Error('Invalid response data')
      }

      authToken.jwt.save(response.data.accessJwt)
      authToken.refresh.save(response.data.refreshToken)

      return response.data ?? {}
    })

export const useGetUserQuery = () => useQuery(['getUser'], () => getUser({}), {})
