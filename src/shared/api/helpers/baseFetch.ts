import { getUserSessionId } from 'shared/lib/getUserSessionId'
import { appRoutePaths } from 'shared/navigation/routerPath'

import { authToken } from '../token'

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'

export interface Options<RequestType> {
  headers?: Record<string, string>
  data?: RequestType
  method?: Method
  sendSessionId?: boolean
  isResponseBlob?: boolean
  isReadOnly?: boolean
  withCredentials?: boolean
}

const genericRequest = async <RequestType, ResponseType>(
  url: string,
  options: Options<RequestType> = {},
): Promise<ResponseType> => {
  const {
    headers: additionalHeaders,
    isResponseBlob = false,
    data,
    withCredentials = true,
    method = 'POST',
    ...opt
  } = options
  const userSessionId = getUserSessionId()
  const jwt = authToken.jwt.get()

  const headers = new Headers({
    'Content-Type': 'application/json',
    ...additionalHeaders,
  })

  if (withCredentials) {
    headers.append('Authorization', `Bearer ${jwt}`)
  }
  if (userSessionId) {
    // headers.append('X-Session-Id', userSessionId)
  }

  return fetch(url, {
    body: data ? JSON.stringify(data) : null,
    headers,
    method,
    ...opt,
  })
    .then(async response => {
      if (isResponseBlob) {
        return (await response.blob()) as any
      }

      if (!response.ok) {
        throw await response.json()
      }

      const data: ResponseType = await response.json()

      return data
    })
    .catch(error => {
      if (
        error.errors?.some(
          (error: { code: string }) =>
            error.code === 'Unauthenticated' && window.location.pathname !== appRoutePaths.auth,
        )
      ) {
        window.location.replace(appRoutePaths.auth)
      } else {
        throw error
      }
    })
}

export const baseFetch = {
  post: <RequestType, ResponseType>(url: string, options: Options<RequestType> = {}) =>
    genericRequest<RequestType, ResponseType>(url, { ...options, method: 'POST' }),
  get: <RequestType, ResponseType>(url: string, options: Options<RequestType> = {}) =>
    genericRequest<RequestType, ResponseType>(url, { ...options, method: 'GET' }),
}
