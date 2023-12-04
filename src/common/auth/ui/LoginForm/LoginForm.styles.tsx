import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  pointOfSaleFormContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    padding: theme.spacing(3),
    gap: theme.spacing(3),
  },

  formMessage: {
    '&.MuiTypography-root': {
      fontWeight: 600,
      fontSize: 22,
      lineHeight: theme.spacing(3),
    },
  },

  loginButton: {
    '&.MuiButton-root': {
      width: '240px',
      height: '48px',
      borderRadius: 12 * theme.shape.borderRadius,
      fontSize: 16,
    },
  },

  errorMessage: {
    color: theme.palette.error.main,
    textAlign: 'center',
  },
}))
