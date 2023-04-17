import { useCallback, useEffect, useMemo, useState } from 'react'

import { appConfig } from 'config'
import { useQuery } from 'react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { getStateAndNonce, getToken } from 'common/auth/api/requests'
import { sleep } from 'shared/lib/sleep'
import { appRoutePaths } from 'shared/navigation/routerPath'

import { authToken } from '../../../../shared/api/token'
import { authorizeUrl } from './utils/authorizeUrl'

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

/** Отслеживаем обратный редирект с TeamID и запрашиваем токены */
export const useCheckAuthRedirect = (onReject: (title: string, text: string) => void) => {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const code = searchParams.get('code') ?? undefined
  const state = searchParams.get('state') ?? undefined

  const fetchData = useCallback(async () => {
    if (code && state) {
      try {
        setIsLoading(true)

        setSearchParams(new URLSearchParams(''))

        const data = await getToken({ authCode: code, state })
        if (!data.jwtAccessToken || !data.refreshToken) {
          throw new Error('Invalid response data')
        }

        // Делаем небольшую паузу, что бы у пользователя перед глазами не мерцал экран
        await sleep(1000)
        authToken.jwt.save(data.jwtAccessToken)
        authToken.refresh.save(data.refreshToken)
        navigate(appRoutePaths.vendorList)
      } catch (err) {
        const makeError = (error: unknown): { message: string } => ({
          message: 'Не удалось авторизоваться, попробуйте еще раз',
        })

        const error = makeError(err)

        onReject('Ошибка авторизации', error.message)
      } finally {
        setIsLoading(false)
      }
    }
  }, [code, state, navigate, onReject, setSearchParams])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { isLoading }
}
