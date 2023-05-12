import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  pointOfSaleFormContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 560,
    height: 'auto',
    boxSizing: 'border-box',
    padding: theme.spacing(3),
    gap: theme.spacing(3),
    borderRadius: 4 * theme.shape.borderRadius,
    boxShadow: `0 4px 16px ${theme.palette.grey[300]}`,
    backgroundColor: theme.palette.background.default,
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
  subtitle: {
    '&.MuiTypography-root': {
      fontWeight: 400,
      fontSize: 14,
      color: theme.palette.grey[500],
      marginBottom: theme.spacing(1),
    },
  },
  autocompleteContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}))
