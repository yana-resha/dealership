import { useEffect, useMemo, useState } from 'react'

import { useQuery } from 'react-query'

import { appConfig } from 'config'
import { getStateAndNonce } from 'shared/api/requests/authsberteamid'

import { useAuthContext } from '../../AuthProvider'
import { getAuthorizeUrl, getLogoutUrl } from '../utils/authorizeUrl'

/** Генерируем ссылку на авторизацию в TeamID */
/** пропс code использовать только на девах! */
export const useGetAuthLink = (code?: string | null) => {
  const [isSuccessRequest, setIsSuccessRequest] = useState(false)
  const { setLogoutUrl } = useAuthContext()

  const { data, error, isLoading } = useQuery(['getStateAndNonce'], () => getStateAndNonce({}), {
    retry: false,
    cacheTime: Infinity,
    /** Вызываем запрос только в том случае если НЕ было успешных попыток */
    enabled: !isSuccessRequest,
  })

  const { authLink, logoutUrl } = useMemo(() => {
    //NOTE: что бы не блочить авторизацию на деве ориентируемся на среду
    if (appConfig.sberTeamAuthEnv === 'dev') {
      return {
        authLink:
          appConfig.appUrl +
          `/auth?code=${code ?? '11111'}&state=${data?.state ?? 'e544b6f3-0697-49af-ac8b-72a39f20f7b8'}`,
        logoutUrl: undefined,
      }
    } else {
      return {
        authLink: data ? getAuthorizeUrl(data) : undefined,
        logoutUrl: data ? getLogoutUrl(data) : undefined,
      }
    }
  }, [data, code])

  /** фиксируем, что получили state и nonce, что бы не вызывать ручку повторно */
  useEffect(() => {
    if (data && !isSuccessRequest) {
      setIsSuccessRequest(true)
    }
  }, [data, isSuccessRequest])

  useEffect(() => {
    if (data && logoutUrl) {
      setLogoutUrl(logoutUrl)
    }
  }, [data, isSuccessRequest, logoutUrl, setLogoutUrl])

  return { authLink, isLoading, error }
}
