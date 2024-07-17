import { memo, useCallback, useMemo, useState } from 'react'

import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'

import { RequiredCatalog, useGetCatalogQuery } from 'shared/api/requests/fileStorageDc.api'
import { useRowsPerPage } from 'shared/hooks/useRowsPerPage'
import { getTablePage, INITIAL_TABLE_PAGE, setTablePage, TableType } from 'shared/tableCurrentPage'
import SberTypography from 'shared/ui/SberTypography'
import { TablePaginationActions } from 'shared/ui/TablePaginationActions'

import { CatalogRow } from './CatalogRow'
import { catalogTableHeaders } from './CatalogTable.config'
import useStyles from './CatalogTable.styles'
import { RemovedFile } from './CatalogTable.types'
import { RemoveModal } from './RemoveModal/RemoveModal'

type Props = {
  currentFolderId: number
  onFolderClick: (folderId: number) => void
  startPage?: number
  rowsPerPage?: number
  foundedFileName?: string
}

const CatalogTable = ({
  currentFolderId,
  onFolderClick,
  rowsPerPage: rowsPerPageProp,
  foundedFileName,
}: Props) => {
  const styles = useStyles()

  const {
    data: catalogData,
    isLoading,
    isFetched,
  } = useGetCatalogQuery({ folderId: currentFolderId }, { enabled: false })

  const data = useMemo(
    () =>
      (catalogData?.catalog || []).filter((catalog: RequiredCatalog) =>
        catalog.name?.includes(foundedFileName || ''),
      ),
    [catalogData?.catalog, foundedFileName],
  )

  const startPage = getTablePage(TableType.CATALOG) || INITIAL_TABLE_PAGE

  const { tableBodyRef, currentRowData, emptyRows, pageCount, page, rowsPerPage, rowHeight, changePage } =
    useRowsPerPage({
      data,
      startPage,
      rowsPerPage: rowsPerPageProp,
      isDataLoaded: !isLoading && isFetched,
    })

  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      changePage(newPage)
      setTablePage(TableType.CATALOG, newPage)
    },
    [changePage],
  )

  const handleFolderClick = useCallback(
    (folderId: number) => {
      onFolderClick(folderId)
      setTablePage(TableType.CATALOG, 1)
    },
    [onFolderClick],
  )

  const [removedFile, setRemovedFile] = useState<RemovedFile>()
  const closeModal = useCallback(() => setRemovedFile(undefined), [])
  const handleRemove = useCallback((file: RemovedFile) => {
    setRemovedFile(file)
  }, [])

  if (isLoading) {
    return (
      <>
        <Skeleton height={rowHeight} width="100%" />
        <Skeleton height={rowHeight} width="100%" />
        <Skeleton height={rowHeight} width="100%" />
      </>
    )
  }

  return (
    <>
      <Table size="small" data-testid="catalogTable" style={{ flexGrow: 1 }}>
        {!data.length && (
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={catalogTableHeaders.length} className={styles.bodyCell}>
                <SberTypography sberautoVariant="body5" component="p">
                  Папка пуста
                </SberTypography>
              </TableCell>
            </TableRow>
          </TableHead>
        )}

        <TableBody className={styles.tableBody} ref={tableBodyRef}>
          {currentRowData.map(row => (
            <CatalogRow key={row.id} onRowClick={handleFolderClick} data={row} onRemove={handleRemove} />
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: rowHeight * emptyRows }}>
              <TableCell colSpan={catalogTableHeaders.length} className={styles.bodyCell} />
            </TableRow>
          )}
        </TableBody>

        {rowsPerPage > 0 && pageCount > 1 && (
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={catalogTableHeaders.length}
                count={data.length}
                rowsPerPageOptions={[rowsPerPage]}
                rowsPerPage={rowsPerPage}
                page={page}
                classes={{
                  root: styles.pagination,
                  toolbar: styles.toolbar,
                }}
                labelDisplayedRows={() => <></>}
                labelRowsPerPage=""
                onPageChange={handleChangePage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        )}
      </Table>

      <RemoveModal currentFolderId={currentFolderId} removedFile={removedFile} closeModal={closeModal} />
    </>
  )
}

const memoizedCatalogTable = memo(CatalogTable)
export { memoizedCatalogTable as CatalogTable }
