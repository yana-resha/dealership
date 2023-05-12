import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    marginTop: theme.spacing(4),
  },

  title: {
    fontSize: '25px!important',
    fontWeight: '600!important',
    lineHeight: '32px!important',
  },

  tableContainer: {
    marginTop: theme.spacing(4),
  },

  headerCell: {
    '&.MuiTableCell-root': {
      padding: theme.spacing(1),
      color: theme.palette.text.secondary,
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
