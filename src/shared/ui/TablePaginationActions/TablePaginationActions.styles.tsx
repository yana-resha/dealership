import { makeStyles } from '@mui/styles'

export default makeStyles(() => ({
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
