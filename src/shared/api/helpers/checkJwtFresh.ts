import { parseJwt } from '../token'

/** Вернет true если токен еще не протух */
export const checkJwtFresh = (jwtStr?: string | null) => {
  if (!jwtStr) {
    return false
  }

  /** Сейчас бэк не умеет регулировать exp,
   * поэтому попросили нас на фронте следить что бы каждый час токен рефрешился,
   * В ручном режиме эмулируем протухание токена используя src/shared/api/helpers/lastRequestControllers */
  const jwt = parseJwt(jwtStr)
  const current_time = new Date().getTime()

  /** за 10 минут до протухания токена,
   * функция заранее возвращает что токен протух, что бы успели обновить */
  return current_time < (jwt?.iat + (60 - 10) * 60) * 1000
}
