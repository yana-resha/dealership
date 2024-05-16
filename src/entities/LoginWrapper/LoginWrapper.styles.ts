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

  loginContainer: {
    padding: theme.spacing(5),
    backgroundColor: theme.palette.background.default,
    boxShadow: '0px 6px 24px rgba(0, 0, 0, .15)',
    borderRadius: theme.spacing(1.25),
  },

  titleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },

  iconButton: {
    height: '30px',
    width: '30px',
  },

  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(),
  },

  title: {
    '&.MuiTypography-root': {
      fontSize: 22.5,
    },
  },

  subtitle: {
    '&.MuiTypography-root': {
      color: theme.palette.text.secondary,
    },
  },
}))
