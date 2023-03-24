import React from 'react'

import { useCheckToken } from 'common/auth/CheckToken'

import { AuthRouter } from './Routers/AuthRouter'
import { MainRouter } from './Routers/MainRouter'
import { useCheckPointOfSale } from 'common/auth/CheckToken/hooks/useCheckPointOfSale'

export function Router(): JSX.Element {
  const isAuth = useCheckToken()
  const isPointSelected = useCheckPointOfSale()

  return isAuth && isPointSelected ? <MainRouter /> : <AuthRouter />
}
