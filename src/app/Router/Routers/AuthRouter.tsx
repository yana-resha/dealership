import React from 'react'

import { Routes, Route } from 'react-router-dom'

import { AuthPage } from 'pages/Auth'
import { PointOfSale } from 'pages/PointOfSale'

import { appRoutePaths } from '../../../shared/navigation/routerPath'

export function AuthRouter(): JSX.Element {
  return (
    <Routes>
      <Route>
        <Route path="*" element={<PointOfSale />} />

        <Route path={appRoutePaths.auth} element={<AuthPage />} />
        <Route path={appRoutePaths.vendorList} element={<PointOfSale />} />
      </Route>
    </Routes>
  )
}
