import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'end',
    gap: theme.spacing(2),
  },

  icon: {
    marginBottom: theme.spacing(0.75),
  },

  errorIcon: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}))
