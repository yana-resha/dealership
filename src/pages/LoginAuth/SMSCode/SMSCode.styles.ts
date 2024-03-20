import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },

  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(3),
    marginTop: theme.spacing(),
  },

  backArrow: {
    '&.MuiIconButton-root': {
      width: theme.spacing(4),
      height: theme.spacing(4),
      transform: 'rotate(90deg)',
      backgroundColor: theme.palette.primary.main,

      '& svg': {
        fill: 'white',
      },

      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },

  timerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: theme.spacing(),
  },

  timer: {
    '&.MuiTypography-root': {
      textAlign: 'center',
    },
  },

  loginFormError: {
    '&.MuiTypography-root': {
      textAlign: 'center',
      color: theme.palette.error.main,
    },
  },

  requireBtn: {
    '&.MuiButton-root': {
      height: '48px',
    },
  },
}))
