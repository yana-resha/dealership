import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  fileLink: {
    '&.MuiLink-root': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textDecoration: 'none',
      cursor: 'pointer',
      minWidth: '30px',
      minHeight: '30px',
      width: 'fit-content',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
}))
