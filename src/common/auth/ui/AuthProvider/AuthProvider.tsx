import React, { useEffect, useState } from 'react'

import { useCheckAuthCookie } from 'common/auth/hooks/useCheckAuthCookie'
import { Rest } from 'shared/api/client'

import { useLogout } from '../../hooks/useLogout'
import { AuthContext } from './context'

type AuthProviderProps = React.PropsWithChildren<{}>

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [logoutUrl, setLogoutUrl] = useState<string>()
  const { logout } = useLogout()
  const isAuth = useCheckAuthCookie(logout)

  // Настраиваем сервис отправки запросов
  useEffect(() => {
    Rest.setLogout(logout)
  }, [logout])

  return <AuthContext.Provider value={{ isAuth, logoutUrl, setLogoutUrl }}>{children}</AuthContext.Provider>
}
