import { createAuthDc, GetUserRequest } from '@sberauto/authdc-proto/public'

import { appConfig } from 'config'
import { Rest } from 'shared/api/client/client'

const authDcApi = createAuthDc(`${appConfig.apiUrl}/authdc`, Rest.request)

export const getUser = (params: GetUserRequest) =>
  authDcApi.getUser({ data: params }).then(response => response.data ?? {})
