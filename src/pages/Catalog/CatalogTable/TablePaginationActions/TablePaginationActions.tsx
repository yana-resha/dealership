import { Pagination, PaginationItem } from '@mui/material'
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions'

import useStyles from '../CatalogTable.styles'

export const TablePaginationActions = (props: TablePaginationActionsProps) => {
  const { count, page, rowsPerPage, onPageChange } = props
  const styles = useStyles()

  const onChange = (event: React.ChangeEvent<unknown>, page: number) => {
    //@ts-expect-error типы евентов не совпадают, но далее сам евент не используется
    onPageChange(event, page)
  }

  return (
    <Pagination
      count={Math.ceil(count / rowsPerPage)}
      renderItem={item => (
        <PaginationItem
          {...item}
          classes={{
            previousNext: styles.prevNext,
            selected: styles.selectedPaginationItem,
          }}
        />
      )}
      siblingCount={3}
      page={page}
      onChange={onChange}
    />
  )
}
