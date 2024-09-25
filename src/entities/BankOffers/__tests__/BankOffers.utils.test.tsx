import { mockedCalculatedProducts } from 'shared/api/requests/dictionaryDc.mock'

import { SortOrder } from '../BankOffers.config'
import { sortBankOffersByNumber, sortBankOffersByString } from '../BankOffers.utils'

describe('BankOffers.utils', () => {
  describe('sortBankOffersByString', () => {
    it('Работает сортировка по строкам', () => {
      expect(sortBankOffersByString(mockedCalculatedProducts, 'productName', SortOrder.ASC)).toMatchObject([
        mockedCalculatedProducts[3],
        mockedCalculatedProducts[4],
        mockedCalculatedProducts[1],
        mockedCalculatedProducts[5],
        mockedCalculatedProducts[2],
        mockedCalculatedProducts[0],
      ])
    })
    it('Работает обратная сортировка по строкам', () => {
      expect(sortBankOffersByString(mockedCalculatedProducts, 'productName', SortOrder.DESC)).toMatchObject(
        [
          mockedCalculatedProducts[3],
          mockedCalculatedProducts[4],
          mockedCalculatedProducts[1],
          mockedCalculatedProducts[5],
          mockedCalculatedProducts[2],
          mockedCalculatedProducts[0],
        ].reverse(),
      )
    })
  })

  describe('sortBankOffersByNumber', () => {
    it('Работает сортировка по числам', () => {
      expect(sortBankOffersByNumber(mockedCalculatedProducts, 'currentRate', SortOrder.ASC)).toMatchObject([
        mockedCalculatedProducts[5],
        mockedCalculatedProducts[0],
        mockedCalculatedProducts[2],
        mockedCalculatedProducts[3],
        mockedCalculatedProducts[1],
        mockedCalculatedProducts[4],
      ])
    })
    it('Работает обратная сортировка по числам', () => {
      expect(sortBankOffersByNumber(mockedCalculatedProducts, 'currentRate', SortOrder.DESC)).toMatchObject([
        mockedCalculatedProducts[1],
        mockedCalculatedProducts[4],
        mockedCalculatedProducts[3],
        mockedCalculatedProducts[0],
        mockedCalculatedProducts[2],
        mockedCalculatedProducts[5],
      ])
    })
  })
})
