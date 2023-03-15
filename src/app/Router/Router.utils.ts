export const appRoutes = {
  dealership: () => '/',
}

export const appRoutePaths: Record<keyof typeof appRoutes, string> = {
  dealership: appRoutes.dealership()
}
