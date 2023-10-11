import { useEffect, useRef, useState } from 'react'

import { checkIsAuth } from 'shared/api/helpers/authCookie'

type Timer = any

/** Проверяет наличие токена */
export const useCheckAuthCookie = (logout: () => void) => {
  const [isAuth, setAuth] = useState(checkIsAuth())
  const timerRef = useRef<Timer | undefined>()

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const newIsAuth = checkIsAuth()
      if (newIsAuth !== isAuth) {
        setAuth(newIsAuth)
        if (!newIsAuth) {
          logout()
        }
      }
    }, 500)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [isAuth, logout])

  return !!isAuth
}
