import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  editingAreaContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(15, 1fr)',
    gap: theme.spacing(3),
  },

  btnContainer: {
    display: 'flex',
    justifyContent: 'end',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(3.6),
  },

  costContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}))
