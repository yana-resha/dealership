import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { PreparedTableData } from './ApplicationTable.types'

type CellsChildren = { name: string; value: string | number | boolean | StatusCode }[]

const HIDDEN_FIELDS = ['id', 'applicationUpdateDate', 'vendorCode']

export const getCellsChildren = (row: PreparedTableData) =>
  Object.entries(row).reduce<CellsChildren>((acc, [key, value]) => {
    //отфильтровываем поля, которые не хотим видеть в таблице
    if (HIDDEN_FIELDS.includes(key)) {
      return acc
    }

    acc.push({ name: key, value })

    return acc
  }, [])
