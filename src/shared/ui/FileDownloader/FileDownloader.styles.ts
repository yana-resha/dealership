import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  avatar: {
    '&.MuiAvatar-root': {
      width: 32,
      height: 32,
      backgroundColor: 'transparent',
    },
  },
  text: {
    color: theme.palette.primary.main,
  },
  fileLink: {
    '&.MuiLink-root': {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      gap: theme.spacing(1),
      cursor: 'pointer',
      width: 'fit-content',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    margin: 'auto',
  },
}))
