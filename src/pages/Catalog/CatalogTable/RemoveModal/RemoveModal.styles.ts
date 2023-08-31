import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  btnContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },

  btn: {
    flexBasis: '50%',
  },
}))
