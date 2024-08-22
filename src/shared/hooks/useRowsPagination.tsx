import { useCallback, useEffect } from 'react'

import { getTablePage, setTablePage, TableType } from 'shared/tableCurrentPage'

type Props<T> = {
  data: T[]
  tableType: TableType
  changePage: (page: number) => void
  isDataLoaded: boolean
}

export const useRowsPagination = <T,>({ data, tableType, changePage, isDataLoaded }: Props<T>) => {
  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      changePage(newPage)
      setTablePage(tableType, newPage)
    },
    [changePage, tableType],
  )

  useEffect(() => {
    if (isDataLoaded && !getTablePage(tableType)) {
      changePage(1)
    }
  }, [tableType, isDataLoaded, changePage])

  return {
    handleChangePage,
  }
}
