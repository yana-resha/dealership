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

  gridContainer: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing(1.5),
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
