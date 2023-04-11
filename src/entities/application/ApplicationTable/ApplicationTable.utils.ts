import { PreparedTableData } from './ApplicationTable.types'

export const getCellsChildrens = (row: PreparedTableData) =>
  Object.entries(row).reduce((acc, [key, value]) => {
    if (key === 'id') {
      return acc
    }

    acc.push({ name: key, value })

    return acc
  }, [] as { name: string; value: string | boolean }[])
