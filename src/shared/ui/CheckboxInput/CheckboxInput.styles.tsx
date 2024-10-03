import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    padding: theme.spacing(0.75, 1.5),
  },
  checkbox: {
    width: theme.spacing(2.25),
    height: theme.spacing(2.25),
    padding: 0,
  },
}))
