import { useCallback, useEffect, useState } from 'react'

import { useNavigate, useSearchParams } from 'react-router-dom'

import { getToken } from 'shared/api/requests/authdc'
import { authToken } from 'shared/api/token'
import { sleep } from 'shared/lib/sleep'
import { appRoutePaths } from 'shared/navigation/routerPath'

/** Отслеживаем обратный редирект с TeamID и запрашиваем токены */
export const useCheckAuthRedirect = (onReject: (text: string) => void) => {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const code = searchParams.get('code') ?? undefined
  const state = searchParams.get('state') ?? undefined
  const isHasCodeAndState = !!code && !!state

  const fetchData = useCallback(async () => {
    if (code && state) {
      try {
        setIsLoading(true)

        setSearchParams(new URLSearchParams(''))

        const data = await getToken({ authCode: code, state })
        if (!data.accessJwt || !data.refreshToken) {
          throw new Error('Invalid response data')
        }

        authToken.jwt.save(data.accessJwt)
        authToken.refresh.save(data.refreshToken)

        // Делаем небольшую паузу, что бы у пользователя перед глазами не мерцал экран
        await sleep(1500)
        navigate(appRoutePaths.vendorList)
      } catch (err) {
        const makeError = (error: unknown): { message: string } => ({
          message: 'Ошибка авторизации. Не удалось авторизоваться, попробуйте еще раз',
        })

        const error = makeError(err)

        onReject(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, state])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { isLoading, isHasCodeAndState }
}
