import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  loaderContainer: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    gap: theme.spacing(4),
  },

  searchContainer: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    borderRadius: theme.spacing(2),
    boxSizing: 'border-box',
    overflow: 'hidden',
    flexShrink: 0,
  },
}))
