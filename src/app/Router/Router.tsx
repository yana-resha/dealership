import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { Dealership } from 'pages/Dealership'
import { DefaultLayout } from 'common/layout/DefaultLayout'

import { appRoutePaths } from './Router.utils'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path={appRoutePaths.dealership} element={<Dealership />} />
      </Route>
    </Routes>
  )
}
