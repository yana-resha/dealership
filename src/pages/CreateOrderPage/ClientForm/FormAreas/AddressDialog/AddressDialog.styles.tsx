import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  content: {
    overflowY: 'auto',
    paddingRight: theme.spacing(1),
  },

  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(3),
  },
}))
