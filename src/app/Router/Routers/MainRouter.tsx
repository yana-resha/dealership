import React from 'react'

import { Routes, Route, Navigate } from 'react-router-dom'

import { DefaultLayout } from 'common/layout/DefaultLayout'
import { DealershipPage } from 'pages/Dealership'
import { NotFoundPage } from 'pages/NotFound'

import { appRoutePaths, defaultRoute } from '../Router.utils'

export function MainRouter(): JSX.Element {
  return (
    <Routes>
      <Route path="*" element={<NotFoundPage />} />
      <Route path={appRoutePaths.auth} element={<Navigate to={defaultRoute} replace />} />
      <Route path={appRoutePaths.vendorList} element={<Navigate to={defaultRoute} replace />} />

      <Route element={<DefaultLayout />}>
        <Route path={appRoutePaths.dealership} element={<Navigate to={defaultRoute} replace />} />
        <Route path={appRoutePaths.orderList} element={<DealershipPage />} />
        <Route path={appRoutePaths.createOrder} element={<DealershipPage />} />
      </Route>
    </Routes>
  )
}
