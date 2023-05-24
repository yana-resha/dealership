import { useEffect, useRef, useState } from 'react'

import { authToken } from 'shared/api/token'

import { useLogout } from './useLogout'

type Timer = any

/** Проверяет наличие токена */
export const useCheckToken = () => {
  const [token, setToken] = useState(authToken.jwt.get())

  const { onLogout } = useLogout()

  const timerRef = useRef<Timer | undefined>()

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const newToken = authToken.jwt.get()
      // eslint-disable-next-line security/detect-possible-timing-attacks
      if (newToken !== token) {
        setToken(newToken)
        if (!newToken) {
          onLogout()
        }
      }
    }, 500)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [onLogout, token])

  return !!token
}
