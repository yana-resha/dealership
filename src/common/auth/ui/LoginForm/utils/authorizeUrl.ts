import { GetStateAndNonceResponse } from '@sberauto/authdc-proto/public'
import { appConfig } from 'config'

import { toSnakecaseKeysData } from 'shared/lib/utils'

function encodeGetParams(p: Record<string, string | undefined>) {
  const validParts = Object.entries(p).filter(p => typeof p[1] === 'string') as [string, string][]

  return validParts.map(kv => kv.map(encodeURIComponent).join('=')).join('&')
}

/* Формируем ссылку на страницу авторизации TeamID */
export const authorizeUrl = ({ state, nonce, redirectUri, scope, clientId }: GetStateAndNonceResponse) => {
  /* TODO DCB-126: может быть SUID | SIAM - нужно проверить при интеграции. */
  const realm = 'SUID'
  const path = `/auth/realms/${realm}/protocol/openidconnect/auth`

  const params = toSnakecaseKeysData({
    clientId,
    redirectUri,
    responseType: 'code',
    /* TODO DCB-126: соединителем может выступать '+' или ' ' - нужно проверить при интеграции. */
    scope,
    /* TODO DCB-126: значение по умолчанию, можно не указывать. Проверить работу без этого параметра. */
    responseMode: 'fragment',
    state,
    nonce,
  })

  const isNotNullable = Object.values(params).reduce((prev, item) => !!item && prev, true)
  if (!isNotNullable) {
    return undefined
  }

  const queryParams = encodeGetParams(params)

  return `${appConfig.sberTeamIdUrl}${path}?${queryParams}`
}
