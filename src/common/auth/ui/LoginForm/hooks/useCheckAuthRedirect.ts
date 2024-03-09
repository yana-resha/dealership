import { useCallback, useEffect, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import { CustomFetchError } from 'shared/api/client'
import { Service, ServiceApi } from 'shared/api/constants'
import { ErrorAlias, ErrorCode, getErrorMessage } from 'shared/api/errors'
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
      setIsLoading(true)
      setSearchParams(new URLSearchParams(''))
      createSession({ authCode: code, state })
        .catch((err: CustomFetchError) =>
          onReject(
            getErrorMessage({
              service: Service.Authdc,
              serviceApi: ServiceApi.CreateSession,
              code: err.code as ErrorCode,
              alias: err.alias as ErrorAlias,
            }),
          ),
        )
        .finally(() => setIsLoading(false))
    }
  }, [code, onReject, setSearchParams, state])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { isLoading, isHasCodeAndState }
}
