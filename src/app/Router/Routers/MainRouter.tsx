import { Routes, Route, Navigate } from 'react-router-dom'

import { DefaultLayout } from 'common/layout/DefaultLayout'
import { Catalog } from 'pages/Catalog'
import { ClientDetailedDossier } from 'pages/ClientDetailedDossier'
import { CreateOrderPage } from 'pages/CreateOrderPage'
import { DealershipPage } from 'pages/Dealership'
import { DevelopmentCoverPage } from 'pages/DevelopmentCover'
import { NotFoundPage } from 'pages/NotFound'
import { appRoutePaths, defaultRoute } from 'shared/navigation/routerPath'

export function MainRouter(): JSX.Element {
  return (
    <Routes>
      <Route path="*" element={<NotFoundPage />} />
      <Route path={appRoutePaths.auth} element={<Navigate to={defaultRoute} replace />} />
      <Route path={appRoutePaths.vendorList} element={<Navigate to={defaultRoute} replace />} />

      <Route element={<DefaultLayout />}>
        <Route path={appRoutePaths.dealership} element={<Navigate to={defaultRoute} replace />} />
        <Route path={appRoutePaths.orderList} element={<DealershipPage />} />
        <Route path={appRoutePaths.createOrder} element={<CreateOrderPage />} />
        <Route path={appRoutePaths.order} element={<ClientDetailedDossier />} />
        <Route path={appRoutePaths.documentStorage} element={<Catalog />} />
        <Route path={appRoutePaths.helpdesk} element={<DevelopmentCoverPage />} />
      </Route>
    </Routes>
  )
}
