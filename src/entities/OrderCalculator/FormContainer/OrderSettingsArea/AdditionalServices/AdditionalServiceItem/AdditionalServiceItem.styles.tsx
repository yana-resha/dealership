import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  gridContainer: {
    gap: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    alignItems: 'flex-end',
  },

  switchContainer: {
    marginBottom: theme.spacing(1),
  },

  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(0.5),
  },
}))
