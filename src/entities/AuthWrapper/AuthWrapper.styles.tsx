import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexGrow: 1,
    height: '100%',
  },

  coverArt: {
    position: 'relative',
    width: '66%',
    height: '100%',
    background: 'linear-gradient(160deg, #BFF7E4 2.67%, #6BB3FB 86.61%)',
    zIndex: 1000,
  },

  imgContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },

  img: {
    display: 'none',
    width: 'auto',
    height: '100%',
    objectFit: 'cover',
  },

  loadedImg: {
    display: 'block',
    animation: '$loadedImg',
    animationDuration: '1.5s',
  },

  '@keyframes loadedImg': {
    from: {
      position: 'relative',
      opacity: 0,
    },
    to: {
      position: 'relative',
      opacity: 1,
    },
  },

  logo: {
    position: 'absolute',
    left: theme.spacing(4),
    top: `${theme.spacing(4)}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    zIndex: 100,
  },

  logoIcon: {
    width: 24,
    height: 24,
  },

  logoTitle: {
    fill: theme.palette.colors.white,
  },

  childrenContainer: {
    position: 'relative',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: theme.palette.background.default,
    overflow: 'hidden',
  },

  logoImgBackground: {
    position: 'absolute',
    left: '-25%',
    bottom: '-15%',
    width: '100%',
    height: 'auto',
    fill: theme.palette.primary.main,
    opacity: 0.1,
  },
}))
