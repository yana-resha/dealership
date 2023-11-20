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
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import cx from 'classnames'

import { useRowsPerPage } from 'shared/hooks/useRowsPerPage'
import { CustomTooltip } from 'shared/ui/CustomTooltip/CustomTooltip'
import SberTypography from 'shared/ui/SberTypography'
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
import { TablePaginationActions } from './TablePaginationActions/TablePaginationActions'

type Props = {
  data: PreparedTableData[]
  onClickRow: (index: string, page: number) => void
  startPage?: number
  isLoading?: boolean
  rowsPerPage?: number
}

export const ApplicationTable = (props: Props) => {
  const { data, onClickRow, startPage = 1, isLoading, rowsPerPage: rowsPerPageProp } = props
  const classes = useStyles()

  const {
    tableBodyRef,
    currentRowData,
    emptyRows,
    pageCount,
    page,
    rowsPerPage,
    rowHeight,
    handleChangePage,
  } = useRowsPerPage({
    data,
    startPage,
    rowsPerPage: rowsPerPageProp,
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
      <TableHead>
        <TableRow className={classes.headerRow}>
          {APPLICATION_HEADERS.map(header => (
            <CustomTooltip
              key={header}
              arrow
              title={header}
              disableHoverListener={header !== ApplicationHeaders.PermitTerm}
            >
              <TableCell
                align="left"
                key={header}
                className={cx(classes.headerCell, {
                  [classes.smallHeaderCell]: header === ApplicationHeaders.PermitTerm,
                  [classes.alignedCell]: ALIGNED_CELL.includes(header),
                })}
              >
                <>{header}</>
              </TableCell>
            </CustomTooltip>
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
            onClick={() => onClickRow(row.applicationNumber, page)}
          >
            {getCellsChildren(row).map((cell, i) => (
              <TableCell
                key={cell.name}
                align="left"
                className={cx(classes.bodyCell, { [classes.alignedCell]: alignedCellIdx.includes(i) })}
              >
                {cell.name === 'status' && <ApplicationStatus status={cell.value as StatusCode} />}
                {cell.name === 'applicationUpdateDate' &&
                  !!cell.value &&
                  convertedDateToString(new Date(cell.value as string), 'dd.LL.yyyy')}
                {cell.name !== 'status' && cell.name !== 'applicationUpdateDate' && cell.value}
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
