import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  headerCell: {
    '&.MuiTableCell-root': {
      padding: theme.spacing(1),
      color: theme.palette.text.secondary,
      borderBottom: 'none',
      textAlign: 'start',
      verticalAlign: 'top',
      textTransform: 'uppercase',
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

  bodyRow: {
    '& td': {
      verticalAlign: 'middle',
    },
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

  bodyCell: {
    '&.MuiTableCell-root': {
      padding: theme.spacing(2, 1),
      borderBottom: 'none',
      boxSizing: 'border-box',
      height: 56,
    },
  },

  nameContainer: {
    maxWidth: '50vw',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  tableBody: {
    flexGrow: 1,
    flexShrink: 0,
  },

  iconCell: {
    '&.MuiTableCell-root': {
      width: 24,
    },
  },

  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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

  prevNext: {
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
  },

  selectedPaginationItem: {
    '&.MuiButtonBase-root.MuiPaginationItem-root': {
      backgroundColor: '#283844',
      color: '#fff',
    },
    '&.MuiButtonBase-root.MuiPaginationItem-root:hover': {
      color: '#283844',
    },
  },
}))
