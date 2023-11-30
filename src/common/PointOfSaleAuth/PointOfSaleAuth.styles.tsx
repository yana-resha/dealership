import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  pointOfSaleFormContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    padding: theme.spacing(3),
    gap: theme.spacing(5),
  },
  closedPointOfSaleFormContainer: {
    left: '-100%',
    opacity: 0,
  },

  closingAnimation: {
    animationName: '$closing',
    animationDuration: '1.5s',
  },

  '@keyframes closing': {
    from: {
      position: 'relative',
      left: 0,
      opacity: 1,
    },
    to: {
      position: 'relative',
      left: '-100%',
      opacity: 0,
    },
  },

  backArrow: {
    '&.MuiIconButton-root': {
      position: 'absolute',
      left: theme.spacing(3),
      top: theme.spacing(3),
      width: theme.spacing(3),
      height: theme.spacing(3),
      zIndex: 2000,
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

  greetingContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },

  formMessage: {
    '&.MuiTypography-root': {
      fontWeight: 600,
      fontSize: 22,
      lineHeight: theme.spacing(3),
      textAlign: 'center',
    },
  },
}))
