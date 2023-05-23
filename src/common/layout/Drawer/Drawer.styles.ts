import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: 'inherit',
    textDecoration: 'none',
    paddingTop: theme.spacing(4),
    margin: '0 auto',

    [theme.breakpoints.up('lg')]: {
      marginLeft: theme.spacing(3),
    },
  },

  logoTitle: {
    display: 'none',
    [theme.breakpoints.up('lg')]: {
      display: 'block',
    },
  },

  navigationMenuDrawer: {
    zIndex: theme.zIndex.drawer + 1,
    height: '100%',
    width: '100%',

    '& .MuiDrawer-paper': {
      height: '100%',
      position: 'relative',
      background: theme.palette.background.default,
      'border-right': 0,
    },
    '&.MuiDrawer-docked': {
      height: '100%',
    },
  },
}))
