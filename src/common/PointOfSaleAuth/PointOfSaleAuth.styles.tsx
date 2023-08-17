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
      zIndex: 2000,
    },
  },

  avatarContainer: {
    '&.MuiAvatar-root': {
      width: '100px',
      height: '100px',
      backgroundColor: theme.palette.grey[100],
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
    alignItems: 'center',
    justifyContent: 'space-evenly',
    minHeight: 191,
    width: '100%',
    flexBasis: '50%',
    zIndex: 1000,
  },

  imgContainer: {
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    width: '50%',
    height: 191,
  },

  carImg: ({ animationDuration }: { animationDuration: number }) => ({
    position: 'absolute',
    // Нельзя положить в animationCarImg, т.к. стиль animationName не работает с функцией
    animationDuration: `${animationDuration}ms`,
  }),

  animationCarImg: {
    animationName: '$car',
  },

  '@keyframes car': {
    from: {
      left: '-100%',
      top: '-100%',
      opacity: 0,
    },
    to: {
      left: 0,
      top: 0,
      opacity: 1,
    },
  },

  greetingTextContainer: {
    position: 'relative',

    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    width: '50%',
    height: '100%',
  },

  formMessage: ({ animationDuration }: { animationDuration: number }) => ({
    '&.MuiTypography-root': {
      fontWeight: 600,
      fontSize: 22,
      lineHeight: theme.spacing(3),
    },

    position: 'absolute',
    width: '100%',
    // Нельзя положить в animationFormMessage, т.к. стиль animationName не работает с функцией
    animationDuration: `${animationDuration}ms`,
  }),

  animationFormMessage: {
    animationName: '$greetingText',
  },

  '@keyframes greetingText': {
    from: {
      marginTop: '100%',
      opacity: 0,
    },
    to: {
      marginTop: '0',
      opacity: 1,
    },
  },
}))
