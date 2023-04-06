import React, { useEffect } from 'react'

import { Rest } from 'shared/api/client/client'

import { refreshAuthByToken } from '../../api/requests'
import { useLogout } from '../../hooks/useLogout'

type Props = React.PropsWithChildren<{}>

const AuthProvider = (props: Props) => {
  const { children } = props

  const { onLogout } = useLogout()

  // Настраиваем сервис отправки запросов
  useEffect(() => {
    Rest.setRefresh(() => refreshAuthByToken({}))
    Rest.setLogout(onLogout)
  }, [onLogout])

  return <>{children}</>
}

export { AuthProvider }
