import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  },

  emailContainer: {
    width: '100%',
  },

  circular: {
    margin: theme.spacing(20, 0),
    alignSelf: 'center',
  },
}))
