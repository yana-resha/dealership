export const appRoutes = {
  dealership: () => '/',
  auth: () => '/auth',
  createOrder: () => '/create_order',
  orderList: () => '/order_list',
}

export const appRoutePaths = {
  dealership: appRoutes.dealership(),
  auth: appRoutes.auth(),
  createOrder: appRoutes.createOrder(),
  orderList: appRoutes.orderList(),
}

export const defaultRoute = appRoutePaths.orderList
