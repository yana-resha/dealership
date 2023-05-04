import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  formContainer: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(3, 0),
    borderRadius: 4 * theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
  },
}))