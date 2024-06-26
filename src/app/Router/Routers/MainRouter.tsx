import { Routes, Route, Navigate } from 'react-router-dom'

import { DefaultLayout } from 'common/layout/DefaultLayout'
import { useUserRoles } from 'entities/user'
import { Calculator } from 'pages/Calculator'
import { Catalog } from 'pages/Catalog'
import { ClientDetailedDossier } from 'pages/ClientDetailedDossier'
import { CreateOrder } from 'pages/CreateOrder'
import { DealershipPage } from 'pages/Dealership'
import { DetailedEmail } from 'pages/DetailedEmail'
import { Emails } from 'pages/Emails'
import { Helpdesk } from 'pages/Helpdesk'
import { NotFoundPage } from 'pages/NotFound'
import { appRoutePaths, defaultRoute } from 'shared/navigation/routerPath'

export function MainRouter(): JSX.Element {
  const {
    auth,
    login,
    documentStorage,
    vendorList,
    documentStorageFolder,
    helpdesk,
    dealership,
    orderList,
    createOrder,
    calculator,
    order,
    fakeAuth,
    emailList: email,
    detailedEmail,
  } = appRoutePaths
  const { isCreditExpert, isContentManager } = useUserRoles()
  const isOnlyContentManager = !isCreditExpert && isContentManager

  if (isOnlyContentManager) {
    return (
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path={auth} element={<Navigate to={documentStorage} replace />} />
        <Route path={login} element={<Navigate to={documentStorage} replace />} />
        <Route path={fakeAuth} element={<Navigate to={documentStorage} replace />} />
        <Route path={vendorList} element={<Navigate to={documentStorage} replace />} />

        <Route element={<DefaultLayout />}>
          <Route path={dealership} element={<Navigate to={documentStorage} replace />} />
          <Route path={documentStorage} element={<Catalog />} />
          <Route path={documentStorageFolder} element={<Catalog />} />
          <Route path={helpdesk} element={<Helpdesk />} />
        </Route>
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="*" element={<NotFoundPage />} />
      <Route path={auth} element={<Navigate to={defaultRoute} replace />} />
      <Route path={login} element={<Navigate to={defaultRoute} replace />} />
      <Route path={fakeAuth} element={<Navigate to={defaultRoute} replace />} />
      <Route path={vendorList} element={<Navigate to={defaultRoute} replace />} />

      <Route element={<DefaultLayout />}>
        <Route path={dealership} element={<Navigate to={defaultRoute} replace />} />
        <Route path={orderList} element={<DealershipPage />} />
        <Route path={createOrder} element={<CreateOrder />} />
        <Route path={calculator} element={<Calculator />} />
        <Route path={order} element={<ClientDetailedDossier />} />
        <Route path={documentStorage} element={<Catalog />} />
        <Route path={documentStorageFolder} element={<Catalog />} />
        <Route path={helpdesk} element={<Helpdesk />} />
        <Route path={email} element={<Emails />} />
        <Route path={detailedEmail} element={<DetailedEmail />} />
      </Route>
    </Routes>
  )
}
