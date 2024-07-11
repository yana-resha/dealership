import { useCallback, useMemo, useState } from 'react'

import { CalculatedProduct } from '@sberauto/dictionarydc-proto/public'

import { HeaderCellKey, SortOrder } from './BankOffers.config'
import { sortBankOffersByNumber, sortBankOffersByString } from './BankOffers.utils'

const DEFAULT_SORT = new Map([[HeaderCellKey.MONTHLY_PAYMENT, SortOrder.ASC]])

export function useSortBankOffers(data: CalculatedProduct[]) {
  const [sortParams, setSortParams] = useState<Map<HeaderCellKey, SortOrder>>(DEFAULT_SORT)

  const sortedData = useMemo(
    () =>
      Array.from(sortParams)
        .reverse()
        .reduce((acc, [curKey, kurValue]) => {
          switch (curKey) {
            case HeaderCellKey.PRODUCT_NAME: {
              return sortBankOffersByString(acc, 'productName', kurValue)
            }
            case HeaderCellKey.MONTHLY_PAYMENT: {
              return sortBankOffersByNumber(acc, 'monthlyPayment', kurValue)
            }
            case HeaderCellKey.OVERPAYMENT: {
              return sortBankOffersByNumber(acc, 'overpayment', kurValue)
            }
            case HeaderCellKey.CURRENT_RATE: {
              return sortBankOffersByNumber(acc, 'currentRate', kurValue)
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
        case SortOrder.ASC: {
          // newSortParams.delete(headerCell) // включить для сложной сортировки
          newSortParams.set(headerCell, SortOrder.DESC)
          break
        }
        case SortOrder.DESC: {
          // newSortParams.delete(headerCell) // включить для сложной сортировки
          newSortParams.set(headerCell, SortOrder.ASC) // удалить для сложной сортировки
          break
        }
        default: {
          newSortParams.set(headerCell, SortOrder.ASC)
          break
        }
      }
      setSortParams(newSortParams)
    },
    [sortParams],
  )

  return { sortParams, sortedData, handleSortBtnClick }
}
