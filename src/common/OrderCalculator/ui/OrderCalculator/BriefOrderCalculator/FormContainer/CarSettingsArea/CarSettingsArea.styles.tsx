import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  gridContainer: {
    gap: theme.spacing(3),
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
  },

  loaderContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },

  errorList: {
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.error.main,
    gap: theme.spacing(2),
  },
}))
