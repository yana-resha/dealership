import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    width: '100%',
  },

  dossierContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },

  circular: {
    margin: theme.spacing(20, 0),
    alignSelf: 'center',
  },
}))
