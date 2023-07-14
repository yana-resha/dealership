import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  loginButton: {
    width: '100%',
    height: '48px',
    '&.MuiButton-root': {
      marginTop: theme.spacing(3),
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
    '& .MuiAutocomplete-popupIndicator': {
      width: '28px',
      height: '28px',
    },
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

  dialogBtn: {
    '&.MuiButton-root': {
      minWidth: 160,
      minHeight: 48,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      borderRadius: 12 * theme.shape.borderRadius,
    },
  },

  dialogText: {
    '&&.MuiDialogContentText-root': {
      color: theme.palette.text.primary,
      marginBottom: theme.spacing(1),
    },
  },

  lastDialogText: {
    '&&.MuiDialogContentText-root': {
      marginBottom: theme.spacing(3),
    },
  },

  dialogContrastText: {
    '&&.MuiDialogContentText-root': {
      color: theme.palette.text.primary,
      fontWeight: '600',
      marginBottom: theme.spacing(1),
    },
  },
}))
