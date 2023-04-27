import { GetTokenRequest, createAuthDc } from '@sberauto/authdc-proto/public'
import { createAuthSberTeamID, GetStateAndNonceRequest } from '@sberauto/authsberteamid-proto/public'

import { appConfig } from 'config'
import { Rest } from 'shared/api/client/client'
import { authToken } from 'shared/api/token'

const authDcApi = createAuthDc(`${appConfig.apiUrl}/authdc`, Rest.request)
const createAuthSberTeamIdApi = createAuthSberTeamID(`${appConfig.apiUrl}/authsberteamid`, Rest.request)

export const getStateAndNonce = (params: GetStateAndNonceRequest) =>
  createAuthSberTeamIdApi.getStateAndNonce(params).then(response => response.data ?? {})

export const getToken = (params: GetTokenRequest) =>
  authDcApi.getToken({ data: params }).then(response => response.data ?? {})

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
