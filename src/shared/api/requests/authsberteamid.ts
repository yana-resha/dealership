import { createAuthSberTeamID, GetStateAndNonceRequest } from '@sberauto/authsberteamid-proto/public'

import { appConfig } from 'config'
import { Rest } from 'shared/api/client'

import { Service } from '../constants'

const authsberteamidApi = createAuthSberTeamID(`${appConfig.apiUrl}/${Service.Authsberteamid}`, Rest.request)

export const getStateAndNonce = (params: GetStateAndNonceRequest) =>
  authsberteamidApi.getStateAndNonce({ data: params }).then(response => response.data || {})
