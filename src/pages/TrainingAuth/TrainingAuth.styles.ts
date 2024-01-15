import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  container: {
    display: 'block',
    width: 520,
  },

  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 0',
  },

  logo: {
    height: '30px',
  },

  title: {
    '&.MuiTypography-root': {
      fontSize: 22.5,
      marginBottom: theme.spacing(),
    },
  },

  subtitle: {
    '&.MuiTypography-root': {
      marginBottom: theme.spacing(3),
      color: theme.palette.text.secondary,
    },
  },

  loginContainer: {
    padding: theme.spacing(5),
    backgroundColor: theme.palette.background.default,
    boxShadow: '0px 6px 24px rgba(0, 0, 0, .15)',
    borderRadius: theme.spacing(1.25),
  },
}))
