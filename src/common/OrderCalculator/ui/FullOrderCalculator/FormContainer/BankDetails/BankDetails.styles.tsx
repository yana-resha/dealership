import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  gridContainer: {
    gap: theme.spacing(3),
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    alignItems: 'start',
  },

  bankAccountContainer: {
    gap: theme.spacing(3),
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
  },

  switchContainer: {
    marginTop: theme.spacing(4),
  },

  btnContainer: {
    display: 'flex',
    marginTop: theme.spacing(3),
    gap: theme.spacing(3),
  },
}))
