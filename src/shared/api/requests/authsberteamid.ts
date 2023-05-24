import { createAuthSberTeamID, GetStateAndNonceRequest } from '@sberauto/authsberteamid-proto/public'

import { appConfig } from 'config'
import { Rest } from 'shared/api/client'

const authsberteamidApi = createAuthSberTeamID(`${appConfig.apiUrl}/authsberteamid`, Rest.request)

export const getStateAndNonce = (params: GetStateAndNonceRequest) =>
  authsberteamidApi.getStateAndNonce({ data: params }).then(response => response.data || {})
