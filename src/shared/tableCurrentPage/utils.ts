import { TableType } from './constants'

export const setTablePage = (tableType: TableType, page: number) => {
  sessionStorage.setItem(tableType, `${page}`)
}

export const getTablePage = (tableType: TableType) => {
  const page = sessionStorage.getItem(tableType)

  return page ? parseInt(page, 10) : undefined
}

export const clearTableSessions = () => {
  const storageKeys = Object.values(TableType)

  storageKeys.forEach(key => {
    sessionStorage.removeItem(key)
  })
}
