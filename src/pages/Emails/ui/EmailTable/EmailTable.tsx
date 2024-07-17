import { memo, useCallback } from 'react'

import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { RequiredEmail } from 'entities/email'
import { useRowsPerPage } from 'shared/hooks/useRowsPerPage'
import { appRoutes } from 'shared/navigation/routerPath'
import { getTablePage, INITIAL_TABLE_PAGE, setTablePage, TableType } from 'shared/tableCurrentPage'
import { CustomTooltip } from 'shared/ui/CustomTooltip/CustomTooltip'
import SberTypography from 'shared/ui/SberTypography'
import { TablePaginationActions } from 'shared/ui/TablePaginationActions'

import { EmailRow } from './EmailRow'
import { EMAIL_TABLE_HEADERS, EmailTableHeader } from './EmailTable.config'
import { useStyles } from './EmailTable.styles'

type Props = {
  emails: RequiredEmail[]
  isLoading: boolean
  isFetched: boolean
}

function EmailTable({ emails, isLoading, isFetched }: Props) {
  const classes = useStyles()
  const navigate = useNavigate()

  const initialPage = getTablePage(TableType.EMAIL) || INITIAL_TABLE_PAGE

  const { tableBodyRef, currentRowData, emptyRows, pageCount, page, rowsPerPage, rowHeight, changePage } =
    useRowsPerPage({
      data: emails,
      startPage: initialPage,
      isDataLoaded: !isLoading && isFetched,
    })

  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      changePage(newPage)
      setTablePage(TableType.CATALOG, newPage)
    },
    [changePage],
  )

  const onRowClick = useCallback(
    (emailId: number) => {
      navigate(appRoutes.detailedEmail(`${emailId}`))
    },
    [navigate],
  )

  const getTooltipTitle = (header: EmailTableHeader) => {
    switch (header) {
      case EmailTableHeader.DATE:
        return 'Дата получения письма'
      case EmailTableHeader.APPLICATION_NUMBER:
        return 'Номер заявки'
      default:
        return header
    }
  }

  if (isLoading) {
    return (
      <Box width="100%" data-testid="dealershipclient.Emails.EmailTable.SkeletonContainer">
        <Skeleton height={rowHeight} />
        <Skeleton height={rowHeight} />
        <Skeleton height={rowHeight} />
      </Box>
    )
  }

  return (
    <Table size="small" data-testid="dealershipclient.Emails.EmailTable" style={{ flexGrow: 1 }}>
      <TableHead className={classes.header}>
        <TableRow className={classes.headerRow}>
          {EMAIL_TABLE_HEADERS.map(header => (
            <TableCell align="left" key={header} className={classes.headerCell}>
              <CustomTooltip
                key={header}
                arrow
                title={getTooltipTitle(header)}
                disableHoverListener={
                  header !== EmailTableHeader.DATE && header !== EmailTableHeader.APPLICATION_NUMBER
                }
                placement="top"
                classes={{
                  tooltip: classes.tooltip,
                }}
              >
                <Box className={classes.headerCellInner}>
                  {header === EmailTableHeader.VIEWED_STATUS ? null : header}
                </Box>
              </CustomTooltip>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      {!emails.length && (
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={EMAIL_TABLE_HEADERS.length} className={classes.bodyCell}>
              <SberTypography sberautoVariant="body5" component="p">
                Письма не найдены
              </SberTypography>
            </TableCell>
          </TableRow>
        </TableHead>
      )}
      <TableBody ref={tableBodyRef}>
        {currentRowData.map(row => (
          <EmailRow key={row.emailId} onRowClick={onRowClick} row={row} />
        ))}
        {emptyRows > 0 && (
          <TableRow style={{ height: rowHeight * emptyRows }}>
            <TableCell colSpan={4} className={classes.bodyCell} />
          </TableRow>
        )}
      </TableBody>

      {rowsPerPage > 0 && pageCount > 1 && (
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={4}
              count={emails.length}
              rowsPerPageOptions={[rowsPerPage]}
              rowsPerPage={rowsPerPage}
              page={page}
              classes={{
                root: classes.pagination,
                toolbar: classes.toolbar,
              }}
              labelDisplayedRows={() => <></>}
              labelRowsPerPage=""
              onPageChange={handleChangePage}
              ActionsComponent={TablePaginationActions}
              data-testid="dealershipclient.Emails.EmailTable.TablePagination"
            />
          </TableRow>
        </TableFooter>
      )}
    </Table>
  )
}

const memoizedEmailTable = memo(EmailTable)
export { memoizedEmailTable as EmailTable }
