import throttle from 'lodash/throttle'

import { appConfig } from 'config'
import { getUserSessionId } from 'shared/lib/getUserSessionId'

import { Options } from '../helpers/baseFetch'
import { authToken } from '../token'

type RefreshMethod = () => Promise<any>
type LogoutMethod = () => Promise<void> | void

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
    if (!authToken.jwt.get()) {
      throw makeError('Unauthorized', 401, 'Token is empty')
    }

    if (!this.isRefreshing) {
      this.setIsRefreshing(true)

      try {
        await this.refreshMethod?.()
      } catch (err) {
        const error = err as unknown as CustomFetchError

        const isAuthError = checkIsAuthError(error)

        if (isAuthError || attempt <= 5) {
          throttle(() => this.logoutMethod?.(), 1500)()
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
    const {
      headers: additionalHeaders,
      isResponseBlob = false,
      data,
      withCredentials = true,
      method = 'POST',
      ...opt
    } = options

    if (!url.includes('refreshAuthByToken')) {
      await this.waitingRefreshed()
    }

    const headers = new Headers({
      'Content-Type': 'application/json',
      ...additionalHeaders,
    })
    const userSessionId = getUserSessionId()
    if (userSessionId) {
      // headers.append('X-Session-Id', userSessionId)
    }
    if (appConfig.dochubApiHeader) {
      headers.append('X-App', appConfig.dochubApiHeader)
    }
    if (withCredentials) {
      headers.append('Authorization', `Bearer ${authToken.jwt.get()}`)
    }

    return fetch(url, {
      body: data ? JSON.stringify(data) : null,
      headers,
      method,
      ...opt,
    })
      .then(async response => {
        if (isResponseBlob) {
          try {
            return (await response.blob()) as any
          } catch (err) {
            throw makeError(response.statusText, response.status, `blob parser error, info: ${err}`)
          }
        }

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

        try {
          return (await response.json()) as ResponseType
        } catch (err) {
          throw makeError(response.statusText, response.status, `json parser error, info: ${err}`)
        }
      })
      .catch(async (error: CustomFetchError) => {
        console.error('fetch error: ', url, JSON.stringify(error))
        if (
          checkIsAuthError(error) &&
          !isRepeated &&
          // Если упал метод refreshAuthByToken, то он не должен тригерить повторный запуск рефреша
          !url.includes('refreshAuthByToken')
        ) {
          await this.refresh()
          await this.waitingRefreshed()

          // Если после рефреша есть токен, значит рефрешнулись успешно
          if (authToken.jwt.get()) {
            /** Запускаем запрос повторно, помечаем что он повторный,
             * если опять упадет по авторизации то выкинет в ошибку */
            this.request(url, options, true)
          } else {
            throw error
          }
        } else {
          throw error
        }
      })
  }
}

const rest = Rest.instance()

export { rest as Rest }
