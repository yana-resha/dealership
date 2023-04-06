import { createAuthDc, GetUserRequest } from '@sberauto/authdc-proto/public'
import { appConfig } from 'config'

import { Rest } from 'shared/api/client/client'

import { mockGetUserResponse } from '../__mocks__/apiMocks'

const authDcApi = createAuthDc(`${appConfig.apiUrl}/auth`, Rest.request)

//TODO DCB-126: Убрать мок из ответа
export const getUser = (params: GetUserRequest) =>
  authDcApi
    .getUser({ data: params })
    .then(response => response.data ?? {})
    .catch(() => mockGetUserResponse())
