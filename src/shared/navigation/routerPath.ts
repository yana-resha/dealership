export const appRoutes = {
  dealership: () => '/',
  auth: () => '/auth',
  fakeAuth: () => '/teamid',
  login: () => '/login',
  vendorList: () => '/vendorlist',
  createOrder: () => '/create_order',
  orderList: () => '/order_list',
  calculator: () => '/calculator',
  order: (applicationId = '') => `/order_list/${applicationId}`,
  documentStorage: () => '/document_storage',
  documentStorageFolder: (folderId = '') => `/document_storage/${folderId}`,
  helpdesk: () => '/helpdesk',
}

export const appRoutePaths = {
  dealership: appRoutes.dealership(),
  auth: appRoutes.auth(),
  fakeAuth: appRoutes.fakeAuth(),
  login: appRoutes.login(),
  vendorList: appRoutes.vendorList(),
  createOrder: appRoutes.createOrder(),
  orderList: appRoutes.orderList(),
  calculator: appRoutes.calculator(),
  order: appRoutes.order(':applicationId'),
  documentStorage: appRoutes.documentStorage(),
  documentStorageFolder: appRoutes.documentStorageFolder(':folderId'),
  helpdesk: appRoutes.helpdesk(),
}
export const defaultRoute = appRoutePaths.orderList
