import { useCallback } from 'react'

import Cookies from 'js-cookie'

import { COOKIE_USER_TOKEN, COOKIE_POINT_OF_SALE } from 'common/auth/auth.constants'

export const useLogout = () => {
  const onLogout = useCallback(() => {
    Cookies.remove(COOKIE_USER_TOKEN)
    Cookies.remove(COOKIE_POINT_OF_SALE)
  }, [])

  return { onLogout }
}
