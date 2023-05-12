import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  requisiteContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },

  requisiteInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: theme.spacing(3),
  },
}))
