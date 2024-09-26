import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  header: {
    '&.MuiTableHead-root': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.15)',
    },
  },

  headerCell: {
    '&.MuiTableCell-root': {
      padding: theme.spacing(1),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      color: theme.palette.text.secondary,
      borderBottom: 'none',
      textAlign: 'start',
      verticalAlign: 'top',
      textTransform: 'uppercase',
    },
  },

  smallHeaderCell: {
    '&.MuiTableCell-root': {
      maxWidth: '50px',
    },
  },

  headerCellInner: {
    width: 'auto',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  smallHeaderCellInner: {
    width: 'min-content',
  },

  alignedCell: {
    '&.MuiTableCell-root': {
      textAlign: 'center',
    },
  },

  headerRow: {
    '& > th:first-child': {
      paddingLeft: theme.spacing(2),
    },
    '& > th:last-child': {
      paddingRight: theme.spacing(2),
    },
  },

  tooltip: {
    marginBottom: `${theme.spacing(1)}!important`,
  },

  tableBody: {
    flexGrow: 1,
    flexShrink: 0,
  },

  bodyCell: {
    '&.MuiTableCell-root': {
      padding: theme.spacing(2, 1),
      borderBottom: 'none',
    },
  },

  bodyRow: {
    '& > td:first-child': {
      paddingLeft: theme.spacing(2),
    },
    '& > td:last-child': {
      paddingRight: theme.spacing(2),
    },

    '&:hover': {
      cursor: 'pointer',
      '& > *': {
        background: theme.palette.background.paper,
      },
      '& > td:first-child': {
        borderTopLeftRadius: 4 * theme.shape.borderRadius,
        borderBottomLeftRadius: 4 * theme.shape.borderRadius,
      },
      '& > td:last-child': {
        borderTopRightRadius: 4 * theme.shape.borderRadius,
        borderBottomRightRadius: 4 * theme.shape.borderRadius,
      },
    },
  },

  toolbar: {
    '&.MuiToolbar-root': {
      display: 'block',
      padding: 0,
    },
  },
  pagination: {
    '&.MuiTablePagination-root': {
      border: 'none',
    },
  },

  statusCell: {
    width: 'fit-content',
  },
}))
