import { useMemo } from 'react'

import { appConfig } from 'config'
import { useQuery } from 'react-query'

import { getStateAndNonce } from 'common/auth/api/requests'

import { authorizeUrl } from '../utils/authorizeUrl'

/** Генерируем ссылку на авторизацию в TeamID */
export const useGetAuthLink = () => {
  const { data, error, isLoading } = useQuery(['getStateAndNonce'], () => getStateAndNonce(), {
    retry: false,
    cacheTime: Infinity,
  })

  const authLink = useMemo(() => {
    //NOTE: что бы не блочить авторизацию на деве пока нет заглушки временно ориентируемся на среду
    if (appConfig.env !== 'prod') {
      return appConfig.appUrl + '/auth?code=test_code&state=test_state'
    } else {
      return data ? authorizeUrl(data) : undefined
    }
  }, [data])

  return { authLink, isLoading, error }
}
