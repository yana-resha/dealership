import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { PreparedTableData } from './ApplicationTable.types'

type CellsChildren = { name: string; value: string | number | boolean | StatusCode }[]

export const getCellsChildren = (row: PreparedTableData) =>
  Object.entries(row).reduce<CellsChildren>((acc, [key, value]) => {
    if (key === 'id') {
      return acc
    }

    acc.push({ name: key, value })

    return acc
  }, [])
