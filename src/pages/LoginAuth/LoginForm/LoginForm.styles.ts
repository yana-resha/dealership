import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',

    '& > form': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',

      width: '100%',
      height: '100%',
    },
  },

  flexContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },

  recoverBtn: {
    '&.MuiButton-root': {
      alignSelf: 'flex-start',
    },
  },

  submitBtn: {
    '&.MuiButton-root': {
      width: '100%',
      height: '48px',
    },
  },

  loginFormError: {
    '&.MuiTypography-root': {
      textAlign: 'center',
      color: theme.palette.error.main,
    },
  },
}))
