import {
  AuthorizeUserRequest,
  AuthorizeUserResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  CheckCodeRequest,
  CheckCodeResponse,
  CheckUserByLoginRequest,
  CheckUserByLoginResponse,
  createAuthDc,
  CreateSessionRequest,
  GetUserRequest,
  TrainingCreateSessionRequest,
  TrainingCreateSessionResponse,
} from '@sberauto/authdc-proto/public'
import { useMutation } from 'react-query'

import { appConfig } from 'config'
import { AUTH_TOKEN } from 'shared/constants/constants'
import { setLocalStorage } from 'shared/lib/helpers'

import { CustomFetchError, Rest } from '../client'
import { Service } from '../constants'
import { setAuthCookie } from '../helpers/authCookie'

const authDcApi = createAuthDc(`${appConfig.apiUrl}/${Service.Authdc}`, Rest.request)

export const createSession = (params: CreateSessionRequest) =>
  authDcApi.createSession({ data: params }).then(res => {
    setAuthCookie()
    if (res.data.tokenCsrf) {
      setLocalStorage(AUTH_TOKEN, res.data.tokenCsrf)
    }

    return res
  })

export const deleteSession = () => authDcApi.deleteSession()

export const getUser = (params: GetUserRequest) =>
  authDcApi.getUser({ data: params }).then(res => res.data ?? {})

export const trainingCreateSession = (params: TrainingCreateSessionRequest) =>
  authDcApi.trainingCreateSession({ data: params }).then(res => {
    setAuthCookie()
    if (res.data.tokenCsrf) {
      setLocalStorage(AUTH_TOKEN, res.data.tokenCsrf)
    }

    return res.data ?? {}
  })
export const useTrainingCreateSessionMutation = () =>
  useMutation<TrainingCreateSessionResponse, CustomFetchError, TrainingCreateSessionRequest, unknown>(
    ['trainingCreateSession'],
    trainingCreateSession,
  )

export const trainingLogout = () => authDcApi.trainingLogout()

export const authorizeUser = (params: AuthorizeUserRequest) =>
  authDcApi.authorizeUser({ data: params }).then(res => res.data ?? {})

export const useAuthorizeUserMutation = () =>
  useMutation<AuthorizeUserResponse, CustomFetchError, AuthorizeUserRequest, unknown>(
    ['authorizeUser'],
    authorizeUser,
  )

export const checkCode = (params: CheckCodeRequest) =>
  authDcApi.checkCode({ data: params }).then(res => {
    setAuthCookie()
    if (res.data.tokenCsrf) {
      setLocalStorage(AUTH_TOKEN, res.data.tokenCsrf)
    }

    return res.data ?? {}
  })

export const useCheckCodeMutation = () =>
  useMutation<CheckCodeResponse, CustomFetchError, CheckCodeRequest, unknown>(['checkCode'], checkCode)

export const checkUserByLogin = (params: CheckUserByLoginRequest) =>
  authDcApi.checkUserByLogin({ data: params }).then(res => res.data ?? {})

export const useCheckUserByLoginMutation = () =>
  useMutation<CheckUserByLoginResponse, CustomFetchError, CheckUserByLoginRequest, unknown>(
    ['checkUserByLogin'],
    checkUserByLogin,
  )

export const changePassword = (params: ChangePasswordRequest) =>
  authDcApi.changePassword({ data: params }).then(res => res.data ?? {})

export const useChangePasswordMutation = () =>
  useMutation<ChangePasswordResponse, CustomFetchError, ChangePasswordRequest, unknown>(
    ['changePassword'],
    changePassword,
  )
