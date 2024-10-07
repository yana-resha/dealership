import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  globalContainer: {
    display: 'flex',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },

  contentContainer: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    marginLeft: 'auto',
  },

  appBar: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,

    '&&': {
      [theme.breakpoints.down('sm')]: {
        zIndex: theme.zIndex.drawer,
      },
    },

    animationName: '$appBar',
    animationDuration: '1.5s',
  },

  '@keyframes appBar': {
    from: {
      position: 'relative',
      top: '-64px',
      opacity: 0,
    },
    to: {
      position: 'relative',
      top: 0,
      opacity: 1,
    },
  },

  main: {
    flexGrow: 1,
    overflow: 'auto',
    minWidth: 'min-content',
    animationName: '$main',
    animationDuration: '1.5s',
  },

  '@keyframes main': {
    from: {
      position: 'relative',
      bottom: '-100%',
      opacity: 0,
    },
    to: {
      position: 'relative',
      bottom: 0,
      opacity: 1,
    },
  },
}))
