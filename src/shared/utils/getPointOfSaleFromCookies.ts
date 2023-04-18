import { Vendor } from '@sberauto/loanapplifecycledc-proto/public'
import Cookies from 'js-cookie'

import { COOKIE_POINT_OF_SALE } from 'entities/pointOfSale'

export const getPointOfSaleFromCookies = (): Vendor => {
  const cookie = Cookies.get(COOKIE_POINT_OF_SALE)

  return cookie ? JSON.parse(cookie) : {}
}
