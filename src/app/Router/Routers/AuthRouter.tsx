import { useEffect } from 'react'

import { Routes, Route, useNavigate } from 'react-router-dom'

import { useAuthContext } from 'common/auth'
import { AuthPage } from 'pages/Auth'
import { LoginAuth } from 'pages/LoginAuth'
import { PointOfSale } from 'pages/PointOfSale'
import { TrainingAuth } from 'pages/TrainingAuth'

import { appRoutePaths } from '../../../shared/navigation/routerPath'

export function AuthRouter(): JSX.Element {
  const navigate = useNavigate()

  const { isAuth } = useAuthContext()

  useEffect(() => {
    if (isAuth) {
      navigate(appRoutePaths.vendorList)
    }
  }, [isAuth, navigate])

  return (
    <Routes>
      <Route>
        <Route path="*" element={<PointOfSale />} />
        <Route path={appRoutePaths.auth} element={<AuthPage />} />
        <Route path={appRoutePaths.fakeAuth} element={<TrainingAuth />} />
        <Route path={appRoutePaths.login} element={<LoginAuth />} />
        <Route path={appRoutePaths.vendorList} element={<PointOfSale />} />
      </Route>
    </Routes>
  )
}
