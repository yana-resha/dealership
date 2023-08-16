import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  editingAreaContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(15, 1fr)',
    gap: theme.spacing(4),
  },
}))
