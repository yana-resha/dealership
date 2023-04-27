import { useEffect, useMemo, useState } from 'react'

import { useQuery } from 'react-query'

import { getStateAndNonce } from 'common/auth/api/requests'
import { appConfig } from 'config'

import { authorizeUrl } from '../utils/authorizeUrl'

/** Генерируем ссылку на авторизацию в TeamID */
export const useGetAuthLink = () => {
  const [isSuccessRequest, setIsSuccessRequest] = useState(false)

  const { data, error, isLoading } = useQuery(['getStateAndNonce'], () => getStateAndNonce({}), {
    retry: false,
    cacheTime: Infinity,
    /** Вызываем запрос только в том случае если НЕ было успешных попыток */
    enabled: !isSuccessRequest,
  })

  /** фиксируем, что получили state и nonce, что бы не вызывать ручку повторно */
  useEffect(() => {
    if (data && !isSuccessRequest) {
      setIsSuccessRequest(true)
    }
  }, [data, isSuccessRequest])

  const authLink = useMemo(() => {
    //NOTE: что бы не блочить авторизацию на деве пока нет заглушки временно ориентируемся на среду
    if (appConfig.env !== 'prod') {
      return appConfig.appUrl + '/auth?code=987654&state=4a7317fa-d18b-4798-a5b5-8bb19665e107'
    } else {
      return data ? authorizeUrl(data) : undefined
    }
  }, [data])

  return { authLink, isLoading, error }
}
