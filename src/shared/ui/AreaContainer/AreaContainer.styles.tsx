import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  areaContainer: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: 4 * theme.shape.borderRadius,
  },
}))
