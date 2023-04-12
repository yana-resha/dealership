import { GetTokenRequest, createAuthDc, RefreshAuthByTokenRequest } from '@sberauto/authdc-proto/public'
import { appConfig } from 'config'

import { Rest } from 'shared/api/client/client'
import { authToken } from 'shared/api/token'

import {
  mockGetRefreshTokenResponse,
  mockGetTokenResponse,
  mockStartAuthSessionResponse,
} from '../__mocks__/apiMocks'

const authDcApi = createAuthDc(`${appConfig.apiUrl}/auth`, Rest.request)

//TODO DCB-126: Убрать мок из ответа
export const getStateAndNonce = () =>
  authDcApi
    .getStateAndNonce()
    .then(response => response.data ?? {})
    .catch(() => mockStartAuthSessionResponse())

//TODO DCB-126: Убрать мок из блока catch
export const getToken = (params: GetTokenRequest) =>
  authDcApi
    .getToken({ data: params })
    .then(response => response.data ?? {})
    .catch(() => mockGetTokenResponse())

//TODO DCB-126: Убрать мок из блока catch
export const refreshAuthByToken = (params: RefreshAuthByTokenRequest) =>
  authDcApi
    .refreshAuthByToken({ data: params })
    .then(response => {
      if (!response.data.jwtAccesToken || !response.data.refreshToken) {
        throw new Error('Invalid response data')
      }
      authToken.jwt.save(response.data.jwtAccesToken)
      authToken.refresh.save(response.data.refreshToken)

      return response.data ?? {}
    })
    .catch(() => {
      const response = { data: mockGetRefreshTokenResponse() }

      if (!response.data.jwtAccesToken || !response.data.refreshToken) {
        throw new Error('Invalid response data')
      }

      authToken.jwt.save(response.data.jwtAccesToken)
      authToken.refresh.save(response.data.refreshToken)

      return response.data ?? {}
    })
