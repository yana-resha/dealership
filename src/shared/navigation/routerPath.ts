export const appRoutes = {
  dealership: () => '/',
  auth: () => '/auth',
  vendorList: () => '/vendorlist',
  createOrder: () => '/create_order',
  orderList: () => '/order_list',
  calculator: () => '/calculator',
  order: (applicationId = '') => `/order_list/${applicationId}`,
  documentStorage: () => '/document_storage',
  helpdesk: () => '/helpdesk',
}

export const appRoutePaths = {
  dealership: appRoutes.dealership(),
  auth: appRoutes.auth(),
  vendorList: appRoutes.vendorList(),
  createOrder: appRoutes.createOrder(),
  orderList: appRoutes.orderList(),
  calculator: appRoutes.calculator(),
  order: appRoutes.order(':applicationId'),
  documentStorage: appRoutes.documentStorage(),
  helpdesk: appRoutes.helpdesk(),
}
export const defaultRoute = appRoutePaths.orderList
