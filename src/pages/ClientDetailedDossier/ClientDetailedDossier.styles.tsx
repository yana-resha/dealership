import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  page: {
    padding: theme.spacing(6),
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  },

  dossierContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: 4 * theme.shape.borderRadius,
  },

  circular: {
    margin: theme.spacing(20, 0),
  },
}))