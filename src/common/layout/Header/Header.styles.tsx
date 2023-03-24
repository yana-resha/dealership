import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `0 ${theme.spacing(3)} 0 ${theme.spacing(31)}`,
    width: '100%',
    height: theme.spacing(10),
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    color: theme.palette.text.primary,
  },

  posNumber: {
    color: theme.palette.grey[600],
  },
}))
