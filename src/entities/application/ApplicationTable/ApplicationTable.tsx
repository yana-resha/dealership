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

import { ApplicationStatus } from '../ApplicationStatus/ApplicationStatus'
import { applicationHeaders } from './ApplicationTable.config'
import useStyles from './ApplicationTable.styles'
import { PreparedTableData } from './ApplicationTable.types'
import { getCellsChildrens } from './ApplicationTable.utils'
import { TablePaginationActions } from './TablePaginationActions/TablePaginationActions'

type Props = {
  data: PreparedTableData[]
  isLoading?: boolean
}

const ROWS_PER_PAGE = 6

export const ApplicationTable = ({ data, isLoading }: Props) => {
  const styles = useStyles()
  const [page, setPage] = useState(1)
  const emptyRows =
    page === Math.ceil(data.length / ROWS_PER_PAGE)
      ? Math.max(0, ROWS_PER_PAGE - (data.length % ROWS_PER_PAGE))
      : 0

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  return (
    <Table size="small">
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
            {data.slice((page - 1) * ROWS_PER_PAGE, (page - 1) * ROWS_PER_PAGE + ROWS_PER_PAGE).map(row => (
              <TableRow
                key={row.applicationNumber}
                className={styles.bodyRow}
                onClick={() => console.log('applicationNumber: ', row.applicationNumber)}
              >
                {getCellsChildrens(row).map(cell => (
                  <TableCell key={cell.name} align="left" className={styles.bodyCell}>
                    {cell.name === 'status' && typeof cell.value === 'string' && (
                      <ApplicationStatus status={cell.value} />
                    )}

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
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={applicationHeaders.length}
                count={data.length}
                rowsPerPageOptions={[ROWS_PER_PAGE]}
                rowsPerPage={ROWS_PER_PAGE}
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
        </>
      )}
    </Table>
  )
}
