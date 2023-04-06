import { useCallback, useEffect, useRef, useState } from 'react'

import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

import { appRoutePaths } from 'shared/navigation/routerPath'

import { COOKIE_JWT_TOKEN } from '../../constants'

type Timer = any

/** Проверяет наличие токена */
export const useCheckToken = () => {
  const [token, setToken] = useState(Cookies.get(COOKIE_JWT_TOKEN))

  const navigate = useNavigate()

  const timerRef = useRef<Timer | undefined>()

  const redirectToLogin = useCallback(() => {
    if (window.location.pathname !== appRoutePaths.auth) {
      navigate(appRoutePaths.auth)
    }
  }, [navigate])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const newToken = Cookies.get(COOKIE_JWT_TOKEN)
      // eslint-disable-next-line security/detect-possible-timing-attacks
      if (newToken !== token) {
        setToken(newToken)

        if (!newToken) {
          redirectToLogin()
        }
      }
    }, 750)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [redirectToLogin, token])

  return !!token
}
