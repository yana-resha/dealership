import { getUserSessionId } from 'shared/lib/getUserSessionId'

import { Options } from '../helpers/baseFetch'
import { authToken } from '../token'

type RefreshMethod = () => Promise<any>
type LogoutMethod = () => Promise<void> | void

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
        await this.refreshMethod?.()
      } catch (error: any) {
        console.warn('Rest.refresh err:', error)

        const isAuthError = error.errors?.some?.(
          (error: { code: string }) => error.code === 'Unauthenticated',
        )

        if (isAuthError || attempt >= 5) {
          await this.logoutMethod?.()
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
          return (await response.blob()) as any
        }

        if (!response.ok) {
          throw await response.json()
        }

        const data: ResponseType = await response.json()

        return data
      })
      .catch(async error => {
        if (
          error.errors?.some((error: { code: string }) => error.code === 'Unauthenticated') &&
          !isRepeated &&
          // Если упал метод refreshAuthByToken, то он не должен тригерить повторный запуск рефреша
          !url.includes('refreshAuthByToken')
        ) {
          this.refresh()
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
