import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    minHeight: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}))
