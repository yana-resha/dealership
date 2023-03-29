import React from 'react'

import { Routes, Route } from 'react-router-dom'

import { DefaultLayout } from 'common/layout/DefaultLayout'
import { AuthPage } from 'pages/Auth'
import { PointOfSale } from 'pages/PointOfSale/PointOfSale'

import { appRoutePaths } from '../Router.utils'

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
