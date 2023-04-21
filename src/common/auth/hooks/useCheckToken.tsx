import { useCallback, useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { appRoutePaths } from 'shared/navigation/routerPath'

import { authToken } from '../../../shared/api/token'

type Timer = any

/** Проверяет наличие токена */
export const useCheckToken = () => {
  const [token, setToken] = useState(authToken.jwt.get())

  const navigate = useNavigate()

  const timerRef = useRef<Timer | undefined>()

  const redirectToLogin = useCallback(() => {
    if (window.location.pathname !== appRoutePaths.auth) {
      navigate(appRoutePaths.auth)
    }
  }, [navigate])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const newToken = authToken.jwt.get()
      // eslint-disable-next-line security/detect-possible-timing-attacks
      if (newToken !== token) {
        setToken(newToken)

        if (!newToken) {
          redirectToLogin()
        }
      }
    }, 500)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [redirectToLogin, token])

  return !!token
}
