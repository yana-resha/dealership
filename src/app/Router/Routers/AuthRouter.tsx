import React from 'react'

import { Routes, Route } from 'react-router-dom'

import { AuthPage } from 'pages/Auth'
import { DefaultLayout } from 'common/layout/DefaultLayout'
import { appRoutePaths } from '../Router.utils'
import { PointOfSale } from 'pages/PointOfSale/PointOfSale'

export function AuthRouter(): JSX.Element {
  return (
    <Routes>
      <Route element={<DefaultLayout isHeader={false} />}>
        <Route path="*" element={<PointOfSale />} />

        <Route path={appRoutePaths.auth} element={<AuthPage />} />
        <Route path={appRoutePaths.vendorList} element={<PointOfSale />} />
      </Route>
    </Routes>
  )
}
