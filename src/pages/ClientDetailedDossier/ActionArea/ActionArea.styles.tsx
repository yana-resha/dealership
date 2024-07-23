import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  blockContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: theme.spacing(3),
  },

  actionButtons: {
    display: 'flex',
    gap: theme.spacing(3),
  },

  buttonsWithProgressBar: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },

  financingButton: {
    width: '267px',
  },
}))
