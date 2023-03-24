import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  pointOfSaleFormContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '413px',
    height: 'auto',
    boxSizing: 'border-box',
    padding: theme.spacing(3),
    gap: theme.spacing(3),
    borderRadius: 4 * theme.shape.borderRadius,
    boxShadow: `0 4px 16px ${theme.palette.grey[300]}`,
  },

  backArrow: {
    '&.MuiIconButton-root': {
      position: 'absolute',
      left: theme.spacing(3),
      top: theme.spacing(3),
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
  },

  avatarContainer: {
    '&.MuiAvatar-root': {
      width: '100px',
      height: '100px',
      backgroundColor: theme.palette.grey[100],
    },
  },

  formMessage: {
    '&.MuiTypography-root': {
      fontWeight: 600,
      fontSize: 19,
      lineHeight: theme.spacing(3),
    },
  },

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
    width: '100%',
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
}))
