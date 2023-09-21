import throttle from 'lodash/throttle'

import { appConfig } from 'config'
import { getUserSessionId } from 'shared/lib/getUserSessionId'

import { Service, getErrorMessage } from '../errors'
import { Options } from './types'

type RefreshMethod = () => Promise<any>
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

function checkIsAuthError(error?: CustomFetchError) {
  const { code, status } = error || {}

  return (!!code && ['Unauthorized', 'Unauthenticated'].includes(code)) || status === 401
}

function getServiceFromUrl(url: string) {
  return url.split('/')[3]
}

let instance: Rest

/** Делает запросы, помогает следить за состоянием токенов */
class Rest {
  /* Обновить токен */
  private refreshMethod?: RefreshMethod
  private logoutMethod?: LogoutMethod
  private isRefreshing?: boolean

  static instance(): Rest {
    if (!instance) {
      instance = new Rest()
    }

    return instance
  }

  /** Установить флаг статуса процесса рефреша токена */
  private setIsRefreshing(value: boolean) {
    this.isRefreshing = value
  }

  setRefresh(method: RefreshMethod) {
    this.refreshMethod = method
  }

  setLogout(method: LogoutMethod) {
    this.logoutMethod = method
  }

  /** Рефрешим токены */
  refresh = async (attempt = 0) => {
    if (!this.isRefreshing) {
      this.setIsRefreshing(true)
      try {
        const res = await this.refreshMethod?.()
        this.setIsRefreshing(false)

        return res
      } catch (err) {
        const error = err as unknown as CustomFetchError
        const isAuthError = checkIsAuthError(error)
        if (isAuthError || attempt <= 5) {
          console.log('refresh_error', error)
          throttle(() => this.logoutMethod?.(getErrorMessage(Service.Authdc, error.code)), 1500)()
        } else {
          await this.refresh(attempt + 1)

          return
        }
      }
      this.setIsRefreshing(false)
    }
  }

  /* Ожидаем пока не завершиться рефреш */
  private waitingRefreshed = async (): Promise<void> => {
    if (!this.isRefreshing) {
      return Promise.resolve()
    } else {
      return new Promise(resolve => {
        const timer = setInterval(() => {
          if (!this.isRefreshing) {
            clearInterval(timer)
            resolve()
          }
        }, 50)
      })
    }
  }

  request = async <RequestType, ResponseType>(
    url: string,
    options: Options<RequestType> = {},
    isRepeated?: boolean,
  ): Promise<ResponseType> => {
    const { headers: additionalHeaders, isResponseBlob = false, data, method = 'POST', ...opt } = options

    if (!url.includes('refreshSession')) {
      await this.waitingRefreshed()
    }

    // Формируем headers
    const isDataFormdata = data instanceof FormData
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...additionalHeaders,
    })
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
        if (
          checkIsAuthError(error) &&
          !isRepeated &&
          // Если упал метод refreshSession, то он не должен тригерить повторный запуск рефреша
          !url.includes('refreshSession')
        ) {
          const refreshRes = await this.refresh()
          await this.waitingRefreshed()
          if (refreshRes?.success) {
            /** Запускаем запрос повторно, помечаем что он повторный,
             * если опять упадет по авторизации то выкинет в ошибку */
            this.request(url, options, true)
          } else {
            throw error
          }
        } else {
          if (isRepeated && checkIsAuthError(error)) {
            const errorMessage = getErrorMessage(getServiceFromUrl(url) as Service, error.code)
            this.logoutMethod?.(errorMessage)
          }
          throw error
        }
      })
  }
}

const rest = Rest.instance()

export { rest as Rest }
