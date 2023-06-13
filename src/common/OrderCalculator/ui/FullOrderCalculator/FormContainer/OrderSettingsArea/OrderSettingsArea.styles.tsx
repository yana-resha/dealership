import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  gridWrapper: {
    gap: theme.spacing(3),
    display: 'grid',
  },

  gridContainer: {
    gap: theme.spacing(3),
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
  },

  errorList: {
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.error.main,
    gap: theme.spacing(2),
  },
}))