import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  optionsWrapper: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: theme.spacing(2),
    alignItems: 'center',
  },

  optionsButton: {
    width: '30px',
    height: '30px',
  },

  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}))
