import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(6),

    [theme.breakpoints.down('sm')]: {
      alignItems: 'unset',
      padding: 0,
      backgroundColor: theme.palette.background.default,
    },
  },

  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    gap: theme.spacing(4),
  },

  searchContainer: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    borderRadius: theme.spacing(2),
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
}))
