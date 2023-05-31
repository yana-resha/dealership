export const appRoutes = {
  dealership: () => '/',
  auth: () => '/auth',
  vendorList: () => '/vendorlist',
  createOrder: () => '/create_order',
  orderList: () => '/order_list',
  fullOrderSettings: () => '/full_order_settings',
}

export const appRoutePaths = {
  dealership: appRoutes.dealership(),
  auth: appRoutes.auth(),
  vendorList: appRoutes.vendorList(),
  createOrder: appRoutes.createOrder(),
  orderList: appRoutes.orderList(),
  fullOrderSettings: appRoutes.fullOrderSettings(),
}

export const defaultRoute = appRoutePaths.orderList
