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

  headerRow: {
    '& > th:first-child': {
      paddingLeft: theme.spacing(1),
    },
    '& > th:last-child': {
      paddingRight: theme.spacing(2),
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
