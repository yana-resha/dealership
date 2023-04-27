import { useEffect } from 'react'

import { Rest } from 'shared/api/client/client'
import { checkJwtFresh } from 'shared/api/helpers/checkJwtFresh'
import { authToken } from 'shared/api/token'

import { useAuthContext } from '../ui/AuthProvider'

/** Обновляет токен, при приближении к протуханию  */
export const useRefreshControl = () => {
  const { isAuth } = useAuthContext()

  useEffect(() => {
    if (!isAuth) {
      return
    }

    let timer: ReturnType<typeof setTimeout>

    async function tick() {
      const jwt = authToken.jwt.get()

      if (jwt && !checkJwtFresh(jwt)) {
        try {
          Rest.refresh()
        } catch {
          console.warn('Rest.refresh error')
        }
      }

      timer = setTimeout(tick, 10000)
    }

    tick()

    return () => {
      clearTimeout(timer)
    }
  }, [isAuth])
}
