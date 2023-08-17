import { GetStateAndNonceResponse } from '@sberauto/authsberteamid-proto/public'

import { appConfig } from 'config'
import { toSnakecaseKeysData } from 'shared/lib/utils'

const REALM = 'SIAM'
const authPath = `/auth/realms/${REALM}/protocol/openid-connect/auth`
const logoutPath = `/auth/realms/${REALM}/protocol/openid-connect/logout`

function encodeGetParams(params: Record<string, string | undefined>) {
  const validParts = Object.entries(params).filter(
    (param): param is [string, string] => typeof param[1] === 'string',
  )

  return validParts
    .map(param => param.map(encodeURIComponent).join('='))
    .join('&')
    .replaceAll('%2B', '+')
}

/* Формируем ссылку на страницу авторизации TeamID */
export const getAuthorizeUrl = ({ state, nonce, redirectUri, scope, clientId }: GetStateAndNonceResponse) => {
  const params = toSnakecaseKeysData({
    clientId,
    redirectUri,
    responseType: 'code',
    /* TODO DCB-181: соединителем может выступать '+' или ' ' - нужно проверить при интеграции. */
    scope,
    /* TODO DCB-181: значение по умолчанию, можно не указывать. Проверить работу без этого параметра. */
    responseMode: 'query',
    state,
    nonce,
  })

  /** Если хотя бы один параметр из списка пустой, то флаг примет значение false */
  const isNotNullable = Object.values(params).reduce((prev, item) => !!item && prev, true)
  if (!isNotNullable) {
    return undefined
  }

  const queryParams = encodeGetParams(params)

  return `${appConfig.sberTeamIdUrl}${authPath}?${queryParams}`
}

export const getLogoutUrl = ({ clientId, redirectUri }: GetStateAndNonceResponse) => {
  const params = toSnakecaseKeysData({
    clientId,
    postLogoutRedirectUri: redirectUri,
  })

  /** Если хотя бы один параметр из списка пустой, то флаг примет значение false */
  const isNotNullable = Object.values(params).reduce((prev, item) => !!item && prev, true)
  if (!isNotNullable) {
    return undefined
  }

  const queryParams = encodeGetParams(params)

  return `${appConfig.sberTeamIdUrl}${logoutPath}?${queryParams}`
}
