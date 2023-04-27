import { useAuthContext } from 'common/auth'
import { useCheckPointOfSale } from 'entities/pointOfSale'

import { AuthRouter } from './Routers/AuthRouter'
import { MainRouter } from './Routers/MainRouter'

export function Router(): JSX.Element {
  const { isAuth } = useAuthContext()
  const isPointSelected = useCheckPointOfSale()

  return isAuth && isPointSelected ? <MainRouter /> : <AuthRouter />
}
