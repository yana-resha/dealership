import Cookies from 'js-cookie'

import { COOKIE_POINT_OF_SALE } from 'entities/pointOfSale'

import { getPointOfSaleFromCookies } from '../getPointOfSaleFromCookies'

const vendorMock = {
  vendorCode: '2002852',
  vendorName: 'Сармат',
  address: 'Ханты-Мансийск Зябликова 4',
}

describe('getPointOfSaleFromCookies', () => {
  beforeEach(() => {
    Cookies.set(COOKIE_POINT_OF_SALE, JSON.stringify(vendorMock))
  })
  afterEach(() => {
    Cookies.remove(COOKIE_POINT_OF_SALE)
  })

  it('возвращает верные расшифрованные значения', () => {
    expect(getPointOfSaleFromCookies()).toMatchObject(vendorMock)
  })
})
