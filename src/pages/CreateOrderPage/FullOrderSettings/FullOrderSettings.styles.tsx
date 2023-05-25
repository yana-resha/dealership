import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  errorContainer: {
    width: '100%',
    padding: theme.spacing(1, 1, 1, 3),
    color: theme.palette.error.main,
  },
}))
