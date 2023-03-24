import { Vendor } from '@sberauto/authdc-proto/public'
import Cookies from 'js-cookie'
import { retrieveLabelForPointOfSale, savePointOfSaleToCookies } from '../pointsOfSale.utils'

describe('PointOfSaleUtilsTest', () => {
  describe('Строковое представление торговой точки формируется корректно', () => {
    it('Строка формируется корректно', () => {
      expect(retrieveLabelForPointOfSale(pointOfSale)).toEqual('Сармат 2002852 Ханты-Мансийск Зябликова 4')
    })
  })

  describe('Торговая точка корректно сохраняется в Cookies', () => {
    it('Торговая точка сохраняется в Cookies', () => {
      savePointOfSaleToCookies(pointOfSale)
      expect(Cookies.get('pointOfSale')).toContain('Сармат')
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
