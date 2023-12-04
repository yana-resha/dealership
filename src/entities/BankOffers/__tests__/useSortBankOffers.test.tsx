import { renderHook } from '@testing-library/react-hooks'

import { mockedCalculatedProducts } from 'shared/api/requests/dictionaryDc.mock'
import { MockProviders } from 'tests/mocks'

import { HeaderCellKey } from '../BankOffers.config'
import { useSortBankOffers } from '../useSortBankOffers'

describe('useSortBankOffers', () => {
  it('Дефолтная сортировка - по возрастанию платежа', () => {
    const { result } = renderHook(() => useSortBankOffers(mockedCalculatedProducts), {
      wrapper: MockProviders,
    })

    expect(result.current.sortParams).toMatchObject(new Map([['monthlyPayment', 'asc']]))
    expect(result.current.sortedData).toMatchObject([
      mockedCalculatedProducts[5],
      mockedCalculatedProducts[0],
      mockedCalculatedProducts[2],
      mockedCalculatedProducts[3],
      mockedCalculatedProducts[1],
      mockedCalculatedProducts[4],
    ])
  })

  it('Работает переключение на сортировку по возрастанию переплаты', () => {
    const { result } = renderHook(() => useSortBankOffers(mockedCalculatedProducts), {
      wrapper: MockProviders,
    })

    result.current.handleSortBtnClick(HeaderCellKey.Overpayment)
    expect(result.current.sortedData).toMatchObject([
      mockedCalculatedProducts[2],
      mockedCalculatedProducts[1],
      mockedCalculatedProducts[5],
      mockedCalculatedProducts[4],
      mockedCalculatedProducts[0],
      mockedCalculatedProducts[3],
    ])
  })

  it('Работает переключение на сортировку по убыванию переплаты', () => {
    const { result } = renderHook(() => useSortBankOffers(mockedCalculatedProducts), {
      wrapper: MockProviders,
    })

    result.current.handleSortBtnClick(HeaderCellKey.Overpayment)
    result.current.handleSortBtnClick(HeaderCellKey.Overpayment)
    expect(result.current.sortedData).toMatchObject(
      [
        mockedCalculatedProducts[2],
        mockedCalculatedProducts[1],
        mockedCalculatedProducts[5],
        mockedCalculatedProducts[4],
        mockedCalculatedProducts[0],
        mockedCalculatedProducts[3],
      ].reverse(),
    )
  })

  // it('Работает переключение на сортировку по КАСКО', () => {
  //   const { result } = renderHook(() => useSortBankOffers(mockedCalculatedProducts), {
  //     wrapper: MockProviders,
  //   })

  //   result.current.handleSortBtnClick(HeaderCellKey.CascoFlag)
  //   expect(result.current.sortedData).toMatchObject([
  //     mockedCalculatedProducts[0],
  //     mockedCalculatedProducts[2],
  //     mockedCalculatedProducts[4],
  //     mockedCalculatedProducts[5],
  //     mockedCalculatedProducts[1],
  //     mockedCalculatedProducts[3],
  //   ])
  // })

  // it('Работает переключение на обратную сортировку по КАСКО', () => {
  //   const { result } = renderHook(() => useSortBankOffers(mockedCalculatedProducts), {
  //     wrapper: MockProviders,
  //   })

  //   result.current.handleSortBtnClick(HeaderCellKey.CascoFlag)
  //   result.current.handleSortBtnClick(HeaderCellKey.CascoFlag)
  //   expect(result.current.sortedData).toMatchObject([
  //     mockedCalculatedProducts[1],
  //     mockedCalculatedProducts[3],
  //     mockedCalculatedProducts[0],
  //     mockedCalculatedProducts[2],
  //     mockedCalculatedProducts[4],
  //     mockedCalculatedProducts[5],
  //   ])
  // })
})
