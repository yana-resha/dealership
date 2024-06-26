import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(6),

    [theme.breakpoints.down('sm')]: {
      alignItems: 'unset',
      padding: 0,
      backgroundColor: theme.palette.background.default,
    },
  },

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
