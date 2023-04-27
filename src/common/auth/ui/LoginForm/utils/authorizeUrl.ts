import { GetStateAndNonceResponse } from '@sberauto/authsberteamid-proto/public'

import { appConfig } from 'config'
import { toSnakecaseKeysData } from 'shared/lib/utils'

function encodeGetParams(params: Record<string, string | undefined>) {
  const validParts = Object.entries(params).filter(
    (param): param is [string, string] => typeof param[1] === 'string',
  )

  return validParts.map(param => param.map(encodeURIComponent).join('=')).join('&')
}

/* Формируем ссылку на страницу авторизации TeamID */
export const authorizeUrl = ({ state, nonce, redirectUri, scope, clientId }: GetStateAndNonceResponse) => {
  /* TODO DCB-181: может быть SUID | SIAM - нужно проверить при интеграции. */
  const realm = 'SUID'
  const path = `/auth/realms/${realm}/protocol/openidconnect/auth`

  const params = toSnakecaseKeysData({
    clientId,
    redirectUri,
    responseType: 'code',
    /* TODO DCB-181: соединителем может выступать '+' или ' ' - нужно проверить при интеграции. */
    scope,
    /* TODO DCB-181: значение по умолчанию, можно не указывать. Проверить работу без этого параметра. */
    responseMode: 'fragment',
    state,
    nonce,
  })

  /** Если хотя бы один параметр из списка пустой, то флаг примет значение true */
  const isNotNullable = Object.values(params).reduce((prev, item) => !!item && prev, true)
  if (!isNotNullable) {
    return undefined
  }

  const queryParams = encodeGetParams(params)

  return `${appConfig.sberTeamIdUrl}${path}?${queryParams}`
}
