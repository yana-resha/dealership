import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  wrapper: {
    display: 'grid',
    gap: '24px',
  },

  gridContainer: {
    gap: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
  },
}))
