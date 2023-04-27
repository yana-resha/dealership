import Cookies from 'js-cookie'

export const COOKIE_JWT_TOKEN = 'authToken'
export const COOKIE_REFRESH_TOKEN = 'refreshToken'

type TokenMethods = {
  save: (value: string) => void
  get: () => string | null
  delete: () => void
}

interface AuthToken {
  jwt: TokenMethods
  refresh: TokenMethods
}

/** Методы работы с токенами */
export const authToken: AuthToken = {
  jwt: {
    save: jwtToken => {
      /** На бэке не умеют настраивать время жизни токена,
       * попросили пока захардкодить вот такой контроллер на фронте
       *
       * Если пользователь не проявлял активности в течении часа,
       * то мы сбрасываем токены и заставляем пользователя перелогиниться
       */
      const currentData = new Date()
      const expiredData = new Date(currentData.getTime() + 1000 * 65 * 60)

      Cookies.set(COOKIE_JWT_TOKEN, jwtToken, { expires: new Date(expiredData) }) // secure: true
    },
    get: () => Cookies.get(COOKIE_JWT_TOKEN) ?? null,
    delete: () => Cookies.remove(COOKIE_JWT_TOKEN),
  },
  refresh: {
    save: refreshToken => {
      /** На бэке не умеют настраивать время жизни токена,
       * попросили пока захардкодить вот такой контроллер на фронте
       *
       * Если пользователь не проявлял активности в течении часа,
       * то мы сбрасываем токены и заставляем пользователя перелогиниться
       */
      const currentData = new Date()
      const expiredData = new Date(currentData.getTime() + 1000 * 65 * 60)

      Cookies.set(COOKIE_REFRESH_TOKEN, refreshToken, { expires: new Date(expiredData) }) // secure: true
    },
    get: () => Cookies.get(COOKIE_REFRESH_TOKEN) ?? null,
    delete: () => Cookies.remove(COOKIE_REFRESH_TOKEN),
  },
}

interface ParsedJwtData {
  exp: number
  iat: number
  iss: string
  sub: string
  scopes: string[]
}

export const parseJwt = (token: string): ParsedJwtData => {
  try {
    const base64Url = token?.split('.')[1]
    const base64 = base64Url?.replace(/-/g, '+')?.replace(/_/g, '/')

    return JSON.parse(atob(base64))
  } catch (error) {
    console.error(error)

    throw error
  }
}
