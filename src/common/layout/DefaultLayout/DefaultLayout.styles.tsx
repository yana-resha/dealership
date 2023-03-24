import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  globalContainer: {
    display: 'flex',
    height: '100%',

    [theme.breakpoints.down('sm')]: {
      display: 'unset',
    },
  },
  appBar: {
    '&&': {
      [theme.breakpoints.down('sm')]: {
        zIndex: theme.zIndex.drawer,
      },
    },
  },
  main: {
    marginTop: 64,
    flexGrow: 1,
  },
}))
