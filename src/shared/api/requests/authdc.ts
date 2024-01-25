import {
  createAuthDc,
  CreateSessionRequest,
  GetUserRequest,
  GetUserResponse,
} from '@sberauto/authdc-proto/public'
import { useQuery } from 'react-query'

import { appConfig } from 'config'
import { AUTH_TOKEN } from 'shared/constants/constants'
import { setLocalStorage } from 'shared/lib/helpers'

import { Rest } from '../client'
import { setAuthCookie } from '../helpers/authCookie'

const authDcApi = createAuthDc(`${appConfig.apiUrl}/authdc`, Rest.request)

export const createSession = (params: CreateSessionRequest) =>
  authDcApi.createSession({ data: params }).then(res => {
    setAuthCookie()
    if (res.data.tokenCsrf) {
      setLocalStorage(AUTH_TOKEN, res.data.tokenCsrf)
    }

    return res
  })

export const refreshSession = () =>
  authDcApi.refreshSession().then(res => {
    setAuthCookie()

    return res
  })

export const deleteSession = () => authDcApi.deleteSession()

export enum Role {
  FrontdcCreditExpert = 'frontdc_credit_expert',
  FrontdcContentManager = 'frontdc_content_manager',
}
export interface PreparedUser extends Omit<GetUserResponse, 'roles'> {
  roles: Record<string, boolean>
}
const prepareUser = (data: GetUserResponse): PreparedUser => {
  const roles = (data.roles || []).reduce((acc, cur) => {
    acc[cur] = true

    return acc
  }, {} as Record<string, boolean>)

  return { ...data, roles }
}
export const getUser = (params: GetUserRequest) =>
  authDcApi.getUser({ data: params }).then(res => (res.data ? prepareUser(res.data) : res.data ?? {}))
export const useGetUserQuery = () => useQuery(['getUser'], () => getUser({}), {})
