import { useCallback, useEffect, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import { Service, getErrorMessage } from 'shared/api/errors'
import { createSession } from 'shared/api/requests/authdc'

/** Отслеживаем обратный редирект с TeamID и запрашиваем токены */
export const useCheckAuthRedirect = (onReject: (text: string) => void) => {
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

        const res = await createSession({ authCode: code, state })
        if (!res.success) {
          throw new Error('Invalid response data')
        }
      } catch (err: any) {
        onReject(getErrorMessage(Service.Authdc, err?.code))
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
