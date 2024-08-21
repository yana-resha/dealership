import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  gridContainer: {
    gap: theme.spacing(3),
    display: 'grid',
    gridTemplateColumns: 'repeat(10, 1fr)',
    alignItems: 'flex-start',
  },

  bankCostContainer: {
    display: 'grid',
    gap: theme.spacing(3),
    gridTemplateColumns: 'repeat(2, 1fr)',
  },

  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(3.6),
  },

  switchContainer: {
    marginTop: theme.spacing(4),
  },
}))
