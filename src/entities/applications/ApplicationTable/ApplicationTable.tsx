import { useCallback, useEffect } from 'react'

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
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import cx from 'classnames'

import { useRowsPagination } from 'shared/hooks/useRowsPagination'
import { useRowsPerPage } from 'shared/hooks/useRowsPerPage'
import { getTablePage, INITIAL_TABLE_PAGE, TableType } from 'shared/tableCurrentPage'
import { CustomTooltip } from 'shared/ui/CustomTooltip'
import SberTypography from 'shared/ui/SberTypography'
import { TablePaginationActions } from 'shared/ui/TablePaginationActions'
import { convertedDateToString } from 'shared/utils/dateTransform'

import { ApplicationStatus } from '../ApplicationStatus/ApplicationStatus'
import {
  ALIGNED_CELL,
  APPLICATION_HEADERS,
  ApplicationHeaders,
  alignedCellIdx,
} from './ApplicationTable.config'
import useStyles from './ApplicationTable.styles'
import { PreparedTableData } from './ApplicationTable.types'
import { getCellsChildren } from './ApplicationTable.utils'

type Props = {
  data: PreparedTableData[]
  onClickRow: (index: string) => void
  isLoading: boolean
  isFetched: boolean
  rowsPerPage?: number
}

export const ApplicationTable = ({
  data,
  onClickRow,
  isLoading,
  isFetched,
  rowsPerPage: rowsPerPageProp,
}: Props) => {
  const classes = useStyles()

  const startPage = getTablePage(TableType.APPLICATION) || INITIAL_TABLE_PAGE

  const { tableBodyRef, currentRowData, emptyRows, pageCount, page, rowsPerPage, rowHeight, changePage } =
    useRowsPerPage({
      data,
      startPage,
      rowsPerPage: rowsPerPageProp,
      isDataLoaded: !isLoading && isFetched,
    })

  const { handleChangePage } = useRowsPagination({
    data,
    tableType: TableType.APPLICATION,
    changePage,
    isDataLoaded: !isLoading && isFetched,
  })

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
    <Table size="small" data-testid="applicationTable" style={{ flexGrow: 1 }}>
      <TableHead className={classes.header}>
        <TableRow className={classes.headerRow}>
          {APPLICATION_HEADERS.map(header => (
            <TableCell
              align="left"
              key={header}
              className={cx(classes.headerCell, {
                [classes.smallHeaderCell]: header === ApplicationHeaders.PermitTerm,
                [classes.alignedCell]: ALIGNED_CELL.includes(header),
              })}
            >
              <CustomTooltip
                key={header}
                arrow
                title={header == ApplicationHeaders.Data ? 'Дата создания заявки' : header}
                disableHoverListener={
                  header !== ApplicationHeaders.PermitTerm && header !== ApplicationHeaders.Data
                }
                placement="top"
                classes={{
                  tooltip: classes.tooltip,
                }}
              >
                <Box
                  className={cx(classes.headerCellInner, {
                    [classes.smallHeaderCellInner]: header === ApplicationHeaders.Data,
                  })}
                >
                  {header}
                </Box>
              </CustomTooltip>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      {!data.length && (
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={APPLICATION_HEADERS.length} className={classes.bodyCell}>
              <SberTypography sberautoVariant="body5" component="p">
                Заявки не найдены
              </SberTypography>
            </TableCell>
          </TableRow>
        </TableHead>
      )}

      <TableBody className={classes.tableBody} ref={tableBodyRef}>
        {currentRowData.map(row => (
          <TableRow
            key={row.applicationNumber}
            className={classes.bodyRow}
            onClick={() => onClickRow(row.applicationNumber)}
          >
            {getCellsChildren(row).map((cell, i) => (
              <TableCell
                key={cell.name}
                align="left"
                className={cx(classes.bodyCell, { [classes.alignedCell]: alignedCellIdx.includes(i) })}
              >
                {cell.name === 'status' && <ApplicationStatus status={cell.value as StatusCode} />}
                {cell.name === 'applicationCreatedDate' &&
                  !!cell.value &&
                  convertedDateToString(new Date(cell.value as string), 'dd.LL.yyyy')}
                {cell.name !== 'status' && cell.name !== 'applicationCreatedDate' && cell.value}
              </TableCell>
            ))}
          </TableRow>
        ))}
        {emptyRows > 0 && (
          <TableRow style={{ height: rowHeight * emptyRows }}>
            <TableCell colSpan={APPLICATION_HEADERS.length} className={classes.bodyCell} />
          </TableRow>
        )}
      </TableBody>

      {rowsPerPage > 0 && pageCount > 1 && (
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={APPLICATION_HEADERS.length}
              count={data.length}
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
            />
          </TableRow>
        </TableFooter>
      )}
    </Table>
  )
}
