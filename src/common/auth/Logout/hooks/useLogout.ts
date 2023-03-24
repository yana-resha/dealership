import { useCallback } from 'react'

import Cookies from 'js-cookie'

import { COOKIE_USER_TOKEN } from 'common/auth/LoginForm/LoginForm.constants'

export const useLogout = () => {
  const onLogout = useCallback(() => {
    Cookies.remove(COOKIE_USER_TOKEN)  
  }, [])

  return { onLogout }
}
