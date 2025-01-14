import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  formContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 4 * theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
  },

  circular: {
    margin: theme.spacing(20, 0),
  },

  clientForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    padding: theme.spacing(3),
    width: '100%',
    boxSizing: 'border-box',
  },

  buttonsArea: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(3),
  },

  buttonsContainer: {
    display: 'flex',
    gap: theme.spacing(3),
  },

  button: {
    '&.MuiButton-root': {
      borderRadius: 12 * theme.shape.borderRadius,
      height: '48px',
      minWidth: '189px',
      fontSize: '16px',
    },
  },
}))
