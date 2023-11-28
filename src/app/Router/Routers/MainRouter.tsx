import { Routes, Route, Navigate } from 'react-router-dom'

import { DefaultLayout } from 'common/layout/DefaultLayout'
import { Calculator } from 'pages/Calculator'
import { Catalog } from 'pages/Catalog'
import { ClientDetailedDossier } from 'pages/ClientDetailedDossier'
import { CreateOrder } from 'pages/CreateOrder'
import { DealershipPage } from 'pages/Dealership'
import { Helpdesk } from 'pages/Helpdesk'
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
        <Route path={appRoutePaths.createOrder} element={<CreateOrder />} />
        <Route path={appRoutePaths.calculator} element={<Calculator />} />
        <Route path={appRoutePaths.order} element={<ClientDetailedDossier />} />
        <Route path={appRoutePaths.documentStorage} element={<Catalog />} />
        <Route path={appRoutePaths.documentStorageFolder} element={<Catalog />} />
        <Route path={appRoutePaths.helpdesk} element={<Helpdesk />} />
      </Route>
    </Routes>
  )
}
