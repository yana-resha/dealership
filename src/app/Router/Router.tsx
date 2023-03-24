import React from 'react'

import { useCheckToken } from 'common/auth/CheckToken'

import { AuthRouter } from './Routers/AuthRouter'
import { MainRouter } from './Routers/MainRouter'

export function Router(): JSX.Element {
  const isAuth = useCheckToken()

  return (
    isAuth ? <MainRouter /> : <AuthRouter />
  )
}
