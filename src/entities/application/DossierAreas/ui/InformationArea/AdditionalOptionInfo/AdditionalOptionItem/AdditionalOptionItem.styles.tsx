import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  additionalOptionItem: {
    display: 'grid',
    gap: theme.spacing(2),
    gridTemplateColumns: 'repeat(7, 1fr)',
  },
}))
