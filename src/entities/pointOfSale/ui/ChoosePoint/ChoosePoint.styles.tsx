import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  loginButton: {
    width: '100%',
    height: '48px',
    '&.MuiButton-root': {
      borderRadius: 12 * theme.shape.borderRadius,
    },
  },

  autocompleteContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },

  errorMessage: {
    color: theme.palette.error.main,
    textAlign: 'center',
  },

  pointsOfSaleAutocomplete: {
    padding: 0,
  },

  autocompleteTextField: {
    '&& .MuiOutlinedInput-root': {
      padding: 0,
    },
    '&& .MuiOutlinedInput-root .MuiAutocomplete-input ': {
      padding: theme.spacing(1.625, 0, 1.5, 2),
      lineHeight: '20px',
    },
  },

  button: {
    backgroundColor: theme.palette.background.paper + '!important',
  },
}))
