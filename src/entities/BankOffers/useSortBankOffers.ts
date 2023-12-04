import { useCallback, useMemo, useState } from 'react'

import { CalculatedProduct } from '@sberauto/dictionarydc-proto/public'

import { HeaderCellKey, SortOrder } from './BankOffers.config'
import { sortBankOffersByCasco, sortBankOffersByNumber, sortBankOffersByString } from './BankOffers.utils'

const DEFAULT_SORT = new Map([[HeaderCellKey.MonthlyPayment, SortOrder.Asc]])

export function useSortBankOffers(data: CalculatedProduct[]) {
  const [sortParams, setSortParams] = useState<Map<HeaderCellKey, SortOrder>>(DEFAULT_SORT)

  const sortedData = useMemo(
    () =>
      Array.from(sortParams)
        .reverse()
        .reduce((acc, [curKey, kurValue]) => {
          switch (curKey) {
            case HeaderCellKey.ProductName: {
              return sortBankOffersByString(acc, 'productName', kurValue)
            }
            case HeaderCellKey.MonthlyPayment: {
              return sortBankOffersByNumber(acc, 'monthlyPayment', kurValue)
            }
            case HeaderCellKey.Overpayment: {
              return sortBankOffersByNumber(acc, 'overpayment', kurValue)
            }
            case HeaderCellKey.CurrentRate: {
              return sortBankOffersByNumber(acc, 'currentRate', kurValue)
            }
            case HeaderCellKey.CascoFlag: {
              return sortBankOffersByCasco(acc, kurValue)
            }
            default:
              return acc
          }
        }, data),
    [data, sortParams],
  )

  const handleSortBtnClick = useCallback(
    (headerCell: HeaderCellKey) => {
      const currentHeaderCell = sortParams.get(headerCell)
      const newSortParams = new Map()
      // Переключить new Map() на new Map(sortParams)
      // для добавления сортируемых колонок (сложная сортировка) вместо переключения.
      // const newSortParams = new Map(sortParams)

      switch (currentHeaderCell) {
        case SortOrder.Asc: {
          // newSortParams.delete(headerCell) // включить для сложной сортировки
          newSortParams.set(headerCell, SortOrder.Desc)
          break
        }
        case SortOrder.Desc: {
          // newSortParams.delete(headerCell) // включить для сложной сортировки
          newSortParams.set(headerCell, SortOrder.Asc) // удалить для сложной сортировки
          break
        }
        default: {
          newSortParams.set(headerCell, SortOrder.Asc)
          break
        }
      }
      setSortParams(newSortParams)
    },
    [sortParams],
  )

  return { sortParams, sortedData, handleSortBtnClick }
}
