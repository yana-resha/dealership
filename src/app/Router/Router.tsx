import { useAuthContext } from 'common/auth'
import { AuthWrapper } from 'entities/AuthWrapper'
import { useCheckPointOfSale } from 'entities/pointOfSale'
import { useGetUserQuery, useUserRoles } from 'entities/user'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'

import { AuthRouter } from './Routers/AuthRouter'
import { MainRouter } from './Routers/MainRouter'

export function Router(): JSX.Element {
  const { isAuth } = useAuthContext()
  const isPointSelected = useCheckPointOfSale()
  const { isCreditExpert, isContentManager } = useUserRoles()
  const { isLoading } = useGetUserQuery({ enabled: isAuth })
  const isAllowedEntrance = (!isCreditExpert && isContentManager) || isPointSelected

  if (isAuth && isLoading) {
    return (
      <AuthWrapper dataTestId="loaderPage">
        <CircularProgressWheel size="extraLarge" />
      </AuthWrapper>
    )
  }

  if (isAuth && isAllowedEntrance) {
    return <MainRouter />
  }

  return <AuthRouter />
}
