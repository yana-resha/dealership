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

  static instance(): Rest {
    if (!instance) {
      instance = new Rest()
    }

    return instance
  }

  /** Установить флаг статуса процесса рефреша токена */
  private setIsRefreshing(value: boolean) {
    /* Используем localStorage, потому что токен один на все вкладки,
    следовательно и процесс рефреша должен быть синхронизирован */
    if (!value) {
      localStorage.removeItem('isRefreshing')
    }
    localStorage.setItem('isRefreshing', `${Number(value)}`)
  }

  /** Получить флаг статуса процесса рефреша токена */
  private getIsRefreshing() {
    const value = localStorage.getItem('isRefreshing')

    return !!Number(value)
  }

  setRefresh(method: RefreshMethod) {
    this.refreshMethod = method
  }

  setLogout(method: LogoutMethod) {
    this.logoutMethod = method
  }

  /** Рефрешим токены */
  private refresh = async (attempt = 0) => {
    if (this.getIsRefreshing()) {
      this.setIsRefreshing(true)

      try {
        await this.refreshMethod?.()
      } catch (error: any) {
        console.log('Rest.refresh err:', error)

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
    if (!this.getIsRefreshing()) {
      return Promise.resolve()
    } else {
      return new Promise(resolve => {
        const timer = setInterval(() => {
          if (!this.getIsRefreshing()) {
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

    await this.waitingRefreshed()

    const headers = new Headers({
      'Content-Type': 'application/json',
      ...additionalHeaders,
    })

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
