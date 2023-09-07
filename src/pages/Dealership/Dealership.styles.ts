import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    boxSizing: 'border-box',
    padding: theme.spacing(7, 6),

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
    marginTop: 200,
  },
}))
