import { useEffect, useRef, useState } from 'react'

import debounce from 'lodash/debounce'

type Props<T> = {
  data: T[]
  startPage?: number
  rowsPerPage?: number
  isDataLoaded: boolean
}

const ROWS_PER_PAGE = 6
const MIN_ROWS_PER_PAGE = 4
const ROW_HEIGHT = 56
/* Чтобы хук работал в полной мере (делал перерасчет при начальном рендере,
т.е. еще без изменения размеров экрана), необходимо родительским элементам задать:
height: 100% (для корневого элемента),
flexGrow: 1 (для остальных родителей),
не забыть про  boxSizing: 'border-box' при необходимости */
export const useRowsPerPage = <T,>({
  data,
  startPage = 1,
  rowsPerPage: rowsPerPageProp,
  isDataLoaded = true,
}: Props<T>) => {
  const tableBodyRef = useRef<HTMLTableSectionElement | null>(null)

  const initialRowsPerPage = rowsPerPageProp ? rowsPerPageProp : ROWS_PER_PAGE
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage)
  const [innerHeight, setInnerHeight] = useState(window.innerHeight)
  const [heightDelta, setHeightDelta] = useState(0)
  const [tableBodyHeight, setTableBodyHeight] = useState<number>()
  const [page, setPage] = useState(startPage)

  const remainder = data.length % rowsPerPage
  const emptyRows =
    page === Math.ceil(data.length / rowsPerPage) && remainder ? Math.max(0, rowsPerPage - remainder) : 0

  const currentRowData =
    rowsPerPage >= 0 ? data.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage) : data
  const pageCount = Math.ceil(data.length / rowsPerPage) || 1

  const changePage = (newPage: number) => {
    setPage(newPage)
  }

  /* Находим начальную высоту элемента. Если родителям были заданы корректные свойства,
  то высота элемента будет подогнана под оставшееся место на экране (но не менее MIN_ROWS_PER_PAGE),
  либо использовано ROWS_PER_PAGE */
  useEffect(() => {
    if (data && !tableBodyHeight && tableBodyRef.current?.clientHeight !== undefined) {
      setTableBodyHeight(tableBodyRef.current?.clientHeight)
    }
  }, [data, tableBodyHeight])

  /* Устанавливаем обработчик на изменение размеров экрана:
  сохраняем новую высоту экрана и дельту к предыдущей высоте */
  useEffect(() => {
    function handleWindowResize() {
      setInnerHeight(window.innerHeight)
      setHeightDelta(window.innerHeight - innerHeight)
    }
    const debouncedFn = debounce(handleWindowResize, 1000)
    window.addEventListener('resize', debouncedFn)

    return () => window.removeEventListener('resize', debouncedFn)
  })

  /* При наличии дельты высоты heightDelta делаем перерасчет количества строк в таблице.
  Обнуляем дельту. */
  useEffect(() => {
    if (tableBodyHeight) {
      const newTableBodyHeight = tableBodyHeight + heightDelta
      const newRowsPerPage =
        Math.floor(newTableBodyHeight / ROW_HEIGHT) >= MIN_ROWS_PER_PAGE
          ? Math.floor(newTableBodyHeight / ROW_HEIGHT)
          : MIN_ROWS_PER_PAGE
      setRowsPerPage(newRowsPerPage)
      setHeightDelta(0)
      setTableBodyHeight(newTableBodyHeight)
    }
  }, [heightDelta, tableBodyHeight])

  useEffect(() => {
    if (isDataLoaded && page > pageCount) {
      setPage(pageCount)
    }
  }, [data, isDataLoaded, page, pageCount])

  return {
    tableBodyRef,
    currentRowData,
    emptyRows,
    pageCount,
    page,
    rowsPerPage,
    rowHeight: ROW_HEIGHT,
    setPage,
    changePage,
  }
}
