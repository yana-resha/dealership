import { useCallback } from 'react'

import Cookies from 'js-cookie'

import { COOKIE_JWT_TOKEN } from 'common/auth/constants'
import { COOKIE_POINT_OF_SALE } from 'entities/pointOfSale/constants'

export const useLogout = () => {
  const onLogout = useCallback(() => {
    Cookies.remove(COOKIE_JWT_TOKEN)
    Cookies.remove(COOKIE_POINT_OF_SALE)
  }, [])

  return { onLogout }
}
