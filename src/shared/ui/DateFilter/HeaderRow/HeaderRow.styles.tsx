import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  header: {
    width: theme.spacing(5),
    height: theme.spacing(4),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.colors.grayNormal,
  },
  row: {
    display: 'flex',
  },
}))
