import React, { useEffect, useState } from 'react'

import { useCheckToken } from 'common/auth/hooks/useCheckToken'
import { useRefreshControl } from 'common/auth/hooks/useRefreshControl'
import { Rest } from 'shared/api/client'
import { refreshAuthByToken } from 'shared/api/requests/authdc'

import { useLogout } from '../../hooks/useLogout'
import { AuthContext } from './context'

type AuthProviderProps = React.PropsWithChildren<{}>

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [logoutUrl, setLogoutUrl] = useState<string>()
  const isAuth = useCheckToken(logoutUrl)
  useRefreshControl()

  const { onLogout } = useLogout()

  // Настраиваем сервис отправки запросов
  useEffect(() => {
    Rest.setRefresh(refreshAuthByToken)
    Rest.setLogout(() => onLogout({ text: 'Ошибка авторизации' }))
  }, [onLogout])

  return <AuthContext.Provider value={{ isAuth, logoutUrl, setLogoutUrl }}>{children}</AuthContext.Provider>
}
