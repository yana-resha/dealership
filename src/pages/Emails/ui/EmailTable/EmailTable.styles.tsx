import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
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

  header: {
    '&.MuiTableHead-root': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.15)',
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

  headerCellInner: {
    width: 'fit-content',
  },

  tooltip: {
    marginBottom: `${theme.spacing(1)}!important`,
  },

  bodyRow: {
    '& td': {
      verticalAlign: 'middle',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '& > td:nth-child(2)': {
      paddingLeft: theme.spacing(2),
      maxWidth: '200px',
    },
    '& > td:nth-child(3)': {
      maxWidth: '400px',
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

  bodyCell: {
    '&.MuiTableCell-root': {
      padding: theme.spacing(2, 1),
      borderBottom: 'none',
      boxSizing: 'border-box',
      height: 56,
    },
  },

  unreadEmail: {
    '& td': {
      fontWeight: 'bold',
    },
  },

  unreadIcon: {
    '&.MuiTableCell-root': {
      padding: theme.spacing(2, 0, 2, 1),
    },
  },
}))
