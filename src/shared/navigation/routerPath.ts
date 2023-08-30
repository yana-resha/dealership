export const appRoutes = {
  dealership: () => '/',
  auth: () => '/auth',
  vendorList: () => '/vendorlist',
  createOrder: () => '/create_order',
  orderList: () => '/order_list',
  order: (applicationId = '') => `/order_list/${applicationId}`,
  fullOrderSettings: () => '/full_order_settings',
  documentStorage: () => '/document_storage',
}

export const appRoutePaths = {
  dealership: appRoutes.dealership(),
  auth: appRoutes.auth(),
  vendorList: appRoutes.vendorList(),
  createOrder: appRoutes.createOrder(),
  orderList: appRoutes.orderList(),
  fullOrderSettings: appRoutes.fullOrderSettings(),
  order: appRoutes.order(':applicationId'),
  documentStorage: appRoutes.documentStorage(),
}
export const defaultRoute = appRoutePaths.orderList
