import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  btnContainer: {
    display: 'flex',
    gap: theme.spacing(2.5),
    width: '100%',
    height: '100%',
  },

  icon: {
    width: '20px',
    height: '20px',
    padding: theme.spacing(0) + '!important',
  },
}))
