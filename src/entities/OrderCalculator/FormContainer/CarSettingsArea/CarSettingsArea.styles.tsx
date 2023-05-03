import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  gridContainer: {
    gap: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    paddingBottom: theme.spacing(3),
  },
}))
