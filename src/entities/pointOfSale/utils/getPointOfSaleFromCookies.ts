import { Vendor } from '@sberauto/dictionarydc-proto/public'
import Cookies from 'js-cookie'

import { COOKIE_POINT_OF_SALE } from '../constants'

export const getPointOfSaleFromCookies = (): Vendor => {
  const cookie = Cookies.get(COOKIE_POINT_OF_SALE)

  return cookie ? JSON.parse(cookie) : {}
}
