import { mockedCalculatedProducts } from 'shared/api/requests/dictionaryDc.mock'

import { SortOrder } from '../BankOffers.config'
import { sortBankOffersByCasco, sortBankOffersByNumber, sortBankOffersByString } from '../BankOffers.utils'

describe('BankOffers.utils', () => {
  describe('sortBankOffersByString', () => {
    it('Работает сортировка по строкам', () => {
      expect(sortBankOffersByString(mockedCalculatedProducts, 'productName', SortOrder.Asc)).toMatchObject([
        mockedCalculatedProducts[1],
        mockedCalculatedProducts[3],
        mockedCalculatedProducts[4],
        mockedCalculatedProducts[5],
        mockedCalculatedProducts[2],
        mockedCalculatedProducts[0],
      ])
    })
    it('Работает обратная сортировка по строкам', () => {
      expect(sortBankOffersByString(mockedCalculatedProducts, 'productName', SortOrder.Desc)).toMatchObject(
        [
          mockedCalculatedProducts[1],
          mockedCalculatedProducts[3],
          mockedCalculatedProducts[4],
          mockedCalculatedProducts[5],
          mockedCalculatedProducts[2],
          mockedCalculatedProducts[0],
        ].reverse(),
      )
    })
  })

  describe('sortBankOffersByNumber', () => {
    it('Работает сортировка по числам', () => {
      expect(sortBankOffersByNumber(mockedCalculatedProducts, 'currentRate', SortOrder.Asc)).toMatchObject([
        mockedCalculatedProducts[5],
        mockedCalculatedProducts[0],
        mockedCalculatedProducts[2],
        mockedCalculatedProducts[3],
        mockedCalculatedProducts[1],
        mockedCalculatedProducts[4],
      ])
    })
    it('Работает обратная сортировка по числам', () => {
      expect(sortBankOffersByNumber(mockedCalculatedProducts, 'currentRate', SortOrder.Desc)).toMatchObject([
        mockedCalculatedProducts[1],
        mockedCalculatedProducts[4],
        mockedCalculatedProducts[3],
        mockedCalculatedProducts[0],
        mockedCalculatedProducts[2],
        mockedCalculatedProducts[5],
      ])
    })
  })

  describe('sortBankOffersByCasco', () => {
    it('Работает сортировка по КАСКО', () => {
      expect(sortBankOffersByCasco(mockedCalculatedProducts, SortOrder.Asc)).toMatchObject([
        mockedCalculatedProducts[0],
        mockedCalculatedProducts[2],
        mockedCalculatedProducts[4],
        mockedCalculatedProducts[5],
        mockedCalculatedProducts[1],
        mockedCalculatedProducts[3],
      ])
    })
    it('Работает обратная сортировка по КАСКО', () => {
      expect(sortBankOffersByCasco(mockedCalculatedProducts, SortOrder.Desc)).toMatchObject([
        mockedCalculatedProducts[1],
        mockedCalculatedProducts[3],
        mockedCalculatedProducts[0],
        mockedCalculatedProducts[2],
        mockedCalculatedProducts[4],
        mockedCalculatedProducts[5],
      ])
    })
  })
})