import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'

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
import SberTypography from 'shared/ui/SberTypography'

import { CatalogRow } from './CatalogRow'
import { catalogTableHeaders } from './CatalogTable.config'
import useStyles from './CatalogTable.styles'
import { RemoveModal, RemovedFile } from './RemoveModal/RemoveModal'
import { TablePaginationActions } from './TablePaginationActions/TablePaginationActions'

type Props = {
  currentFolderId: number
  onFolderClick: (folderId: number) => void
  startPage?: number
  rowsPerPage?: number
  foundedFileName?: string
}

const ROWS_PER_PAGE = 6

const CatalogTable = ({
  currentFolderId,
  onFolderClick,
  startPage = 1,
  rowsPerPage: rowsPerPageProp,
  foundedFileName,
}: Props) => {
  const styles = useStyles()

  const { data: catalogData, isLoading } = useGetCatalogQuery(
    { folderId: currentFolderId },
    { enabled: false },
  )

  const data = useMemo(
    () =>
      (catalogData?.catalog || []).filter((catalog: RequiredCatalog) =>
        catalog.name?.includes(foundedFileName || ''),
      ),
    [catalogData?.catalog, foundedFileName],
  )

  const [page, setPage] = useState(startPage)

  const rowsPerPage = rowsPerPageProp ? rowsPerPageProp : ROWS_PER_PAGE
  const emptyRows =
    page === Math.ceil(data.length / rowsPerPage) ? Math.max(0, rowsPerPage - (data.length % rowsPerPage)) : 0

  useEffect(() => {
    setPage(1)
  }, [data])

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const [removedFile, setRemovedFile] = useState<RemovedFile>()
  const closeModal = useCallback(() => setRemovedFile(undefined), [])
  const handleRemove = useCallback((id: number, name: string) => {
    setRemovedFile({ id, name })
  }, [])

  const currentRowData =
    rowsPerPage >= 0 ? data.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage) : data
  const pageCount = Math.ceil(data.length / rowsPerPage)

  if (isLoading) {
    return (
      <>
        <Skeleton height={56} width="100%" />
        <Skeleton height={56} width="100%" />
        <Skeleton height={56} width="100%" />
      </>
    )
  }

  return (
    <>
      <Table size="small" data-testid="catalogTable">
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

        <TableBody>
          {currentRowData.map(row => (
            <CatalogRow key={row.id} onRowClick={onFolderClick} data={row} onRemove={handleRemove} />
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 56 * emptyRows }}>
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
