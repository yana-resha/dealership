import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  gridContainer: {
    gap: theme.spacing(3),
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}))
