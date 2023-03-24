import { useCallback, useEffect, useRef, useState } from 'react'

import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { COOKIE_POINT_OF_SALE } from 'common/auth/auth.constants'
import { appRoutePaths } from 'app/Router/Router.utils'

type Timer = any

/** Проверяет наличие выбранной точки продаж */
export const useCheckPointOfSale = () => {
  const [point, setPoint] = useState(Cookies.get(COOKIE_POINT_OF_SALE))

  const navigate = useNavigate()

  const timerRef = useRef<Timer | undefined>()

  const redirectToLogin = useCallback(() => {
    if (window.location.pathname !== appRoutePaths.vendorList) {
      navigate(appRoutePaths.vendorList)
    }
  }, [navigate])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const newPoint = Cookies.get(COOKIE_POINT_OF_SALE)
      // eslint-disable-next-line security/detect-possible-timing-attacks
      if (newPoint !== point) {
        setPoint(newPoint)

        if (!newPoint) {
          redirectToLogin()
        }
      }
    }, 750)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [redirectToLogin, point])

  return !!point
}
