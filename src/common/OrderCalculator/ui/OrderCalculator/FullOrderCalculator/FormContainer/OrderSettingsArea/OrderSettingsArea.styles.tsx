import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  gridWrapper: {
    gap: theme.spacing(3),
    display: 'grid',
  },

  errorList: {
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.error.main,
    gap: theme.spacing(2),
  },

  loaderContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
}))
