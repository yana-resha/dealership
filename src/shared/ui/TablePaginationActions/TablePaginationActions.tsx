import { Pagination, PaginationItem } from '@mui/material'
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions'

import useStyles from './TablePaginationActions.styles'

export const TablePaginationActions = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
}: TablePaginationActionsProps) => {
  const classes = useStyles()

  const onChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(null, page)
  }

  return (
    <Pagination
      count={Math.ceil(count / rowsPerPage)}
      renderItem={item => (
        <PaginationItem
          {...item}
          classes={{
            previousNext: classes.prevNext,
            selected: classes.selectedPaginationItem,
          }}
        />
      )}
      siblingCount={3}
      page={page}
      onChange={onChange}
    />
  )
}
