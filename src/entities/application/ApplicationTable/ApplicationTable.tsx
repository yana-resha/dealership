import { useState } from 'react'

import { MailOutline } from '@mui/icons-material'
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { ApplicationStatus } from '../ApplicationStatus/ApplicationStatus'
import { applicationHeaders } from './ApplicationTable.config'
import useStyles from './ApplicationTable.styles'
import { PreparedTableData } from './ApplicationTable.types'
import { getCellsChildrens } from './ApplicationTable.utils'
import { TablePaginationActions } from './TablePaginationActions/TablePaginationActions'

type Props = {
  data: PreparedTableData[]
  onClickRow: (index: string, page: number) => void
  startPage?: number
  isLoading?: boolean
  rowsPerPage?: number
}

const ROWS_PER_PAGE = 6

export const ApplicationTable = ({
  data,
  onClickRow,
  startPage = 1,
  isLoading,
  rowsPerPage: rowsPerPageProp,
}: Props) => {
  const rowsPerPage = rowsPerPageProp ? rowsPerPageProp : ROWS_PER_PAGE
  const styles = useStyles()
  const [page, setPage] = useState(startPage)
  const emptyRows =
    page === Math.ceil(data.length / rowsPerPage) ? Math.max(0, rowsPerPage - (data.length % rowsPerPage)) : 0

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  return (
    <Table size="small" data-testid="applicationTable">
      {isLoading ? (
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={applicationHeaders.length} className={styles.bodyCell}>
              <CircularProgress />
            </TableCell>
          </TableRow>
        </TableHead>
      ) : (
        <>
          <TableHead>
            <TableRow className={styles.headerRow}>
              {applicationHeaders.map(header => (
                <TableCell align="left" key={header} className={styles.headerCell}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage).map(row => (
              <TableRow
                key={row.applicationNumber}
                className={styles.bodyRow}
                onClick={() => onClickRow(row.applicationNumber, page)}
              >
                {getCellsChildrens(row).map(cell => (
                  <TableCell key={cell.name} align="left" className={styles.bodyCell}>
                    {cell.name === 'status' && <ApplicationStatus status={cell.value as StatusCode} />}

                    {cell.name === 'isDC' && cell.value && <MailOutline htmlColor="#DADADA" />}

                    {cell.name !== 'status' && cell.name !== 'isDC' && cell.value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 72 * emptyRows }}>
                <TableCell colSpan={applicationHeaders.length} className={styles.bodyCell} />
              </TableRow>
            )}
          </TableBody>
          {rowsPerPage > 0 && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={applicationHeaders.length}
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
        </>
      )}
    </Table>
  )
}