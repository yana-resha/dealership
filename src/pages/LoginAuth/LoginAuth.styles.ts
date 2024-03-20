import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: 'inherit',
    textDecoration: 'none',
  },

  wrapper: {
    position: 'relative',
    minHeight: '350px',
    width: '100%',
    overflow: 'hidden',
  },

  animatingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  closedAnimatingContainer: {
    top: '-100%',
  },

  openingAnimation: {
    animationName: '$opening',
    animationDuration: '1.5s',
  },
  '@keyframes opening': {
    from: {
      top: '-100%',
    },
    to: {
      top: 0,
    },
  },

  closingAnimation: {
    animationName: '$closing',
    animationDuration: '1.5s',
  },
  '@keyframes closing': {
    from: {
      top: 0,
    },
    to: {
      top: '-100%',
    },
  },
}))
