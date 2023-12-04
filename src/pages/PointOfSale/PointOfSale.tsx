import { Navigate } from 'react-router-dom'

import { useAuthContext } from 'common/auth'
import { PointOfSaleAuth } from 'common/PointOfSaleAuth'
import { AuthWrapper } from 'entities/AuthWrapper'
import { appRoutePaths } from 'shared/navigation/routerPath'

export function PointOfSale() {
  const { isAuth } = useAuthContext()

  if (!isAuth) {
    return <Navigate to={appRoutePaths.auth} replace />
  }

  return (
    <AuthWrapper dataTestId="pointOfSalePage">
      <PointOfSaleAuth />
    </AuthWrapper>
  )
}
