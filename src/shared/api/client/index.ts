import throttle from 'lodash/throttle'

import { appConfig } from 'config'
import { AUTH_TOKEN } from 'shared/constants/constants'
import { getUserSessionId } from 'shared/lib/getUserSessionId'
import { getLocalStorage } from 'shared/lib/helpers'

import { Service, getErrorMessage } from '../errors'
import { Options } from './types'

type LogoutMethod = (errorMessage?: string) => Promise<void> | void

type FetchError = {
  success: false
  errors: {
    code: string
    description: string
    data?: {
      description?: string
    }
  }[]
}

export type CustomFetchError = {
  code: string
  status: number
  info?: string
  ok: false
}

function makeError(code: string, status: number, info?: string): CustomFetchError {
  return { code, status, ok: false, info }
}

export function checkIsAuthError(error?: CustomFetchError) {
  const { code, status } = error || {}

  return (!!code && ['Unauthorized', 'Unauthenticated'].includes(code)) || status === 401
}

function getServiceFromUrl(url: string) {
  return url.split('/')[3]
}

let instance: Rest

/** Делает запросы, помогает следить за состоянием токенов */
class Rest {
  private logoutMethod?: LogoutMethod

  static instance(): Rest {
    if (!instance) {
      instance = new Rest()
    }

    return instance
  }

  setLogout(method: LogoutMethod) {
    this.logoutMethod = method
  }

  request = async <RequestType, ResponseType>(
    url: string,
    options: Options<RequestType> = {},
  ): Promise<ResponseType> => {
    const { headers: additionalHeaders, isResponseBlob = false, data, method = 'POST', ...opt } = options

    // Формируем headers
    const isDataFormdata = data instanceof FormData
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...additionalHeaders,
    })
    const authToken = getLocalStorage<string>(AUTH_TOKEN)
    if (authToken) {
      headers.append('Token-Csrf', authToken)
    }
    const userSessionId = getUserSessionId()
    if (userSessionId) {
      headers.append('X-Session-Id', userSessionId)
    }
    if (appConfig.dochubApiHeader) {
      headers.append('X-App', appConfig.dochubApiHeader)
    }
    if (isDataFormdata) {
      headers.delete('Content-Type')
    }

    // Формируем body
    const body = (() => {
      if (isDataFormdata) {
        return data
      }
      if (data) {
        return JSON.stringify(data)
      }

      return null
    })()

    return fetch(url, {
      body,
      headers,
      method,
      credentials: 'include',
      ...opt,
    })
      .then(async response => {
        if (!response.ok) {
          let error: FetchError | undefined
          try {
            error = (await response.json()) as FetchError
          } catch (err) {
            throw makeError(response.statusText, response.status, `${err}`)
          }

          const { code, description } = error?.errors?.[0] || {}
          throw makeError(code, response.status, description)
        }

        if (isResponseBlob) {
          try {
            return (await response.blob()) as any
          } catch (err) {
            throw makeError(response.statusText, response.status, `blob parser error, info: ${err}`)
          }
        }
        try {
          return (await response.json()) as ResponseType
        } catch (err) {
          throw makeError(response.statusText, response.status, `json parser error, info: ${err}`)
        }
      })
      .catch(async (error: CustomFetchError) => {
        if (checkIsAuthError(error)) {
          const errorMessage = getErrorMessage(getServiceFromUrl(url) as Service, error.code)
          this.logoutMethod?.(errorMessage)
        }
        throw error
      })
  }
}

const rest = Rest.instance()

export { rest as Rest }
