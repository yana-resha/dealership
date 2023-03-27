import { Vendor } from '@sberauto/authdc-proto/public'
import Cookies from 'js-cookie'

import { COOKIE_POINT_OF_SALE } from 'entities/constants/auth.constants'

import { retrieveLabelForPointOfSale, savePointOfSaleToCookies } from '../ChoosePoint.utils'

describe('PointOfSaleUtilsTest', () => {
  beforeEach(() => {
    Cookies.remove(COOKIE_POINT_OF_SALE)
  })

  describe('Строковое представление торговой точки формируется корректно', () => {
    it('Строка формируется корректно', () => {
      expect(retrieveLabelForPointOfSale(pointOfSale)).toEqual('Сармат 2002852 Ханты-Мансийск Зябликова 4')
    })
  })

  describe('Торговая точка корректно сохраняется в Cookies', () => {
    it('Торговая точка сохраняется в Cookies', () => {
      savePointOfSaleToCookies(pointOfSale)
      expect(Cookies.get(COOKIE_POINT_OF_SALE)).toContain('Сармат')
    })
  })

  describe('Торговая точка не сохраняется в Cookies, если нет значения', () => {
    it('Торговая точка сохраняется в Cookies', () => {
      savePointOfSaleToCookies(null)
      expect(Cookies.get(COOKIE_POINT_OF_SALE)).toBeUndefined()
    })
  })
})

const pointOfSale: Vendor = {
  vendorCode: '2002852',
  vendorName: 'Сармат',
  cityName: 'Ханты-Мансийск',
  houseNumber: '4',
  streetName: 'Зябликова',
}
