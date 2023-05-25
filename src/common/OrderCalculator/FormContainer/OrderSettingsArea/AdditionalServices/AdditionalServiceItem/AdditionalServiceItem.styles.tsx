import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  gridContainer: {
    gap: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    alignItems: 'flex-start',
  },

  switchContainer: {
    marginTop: theme.spacing(4),
  },

  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(3.6),
  },
}))
