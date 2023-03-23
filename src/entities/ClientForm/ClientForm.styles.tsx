import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  formContainer: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: 4 * theme.shape.borderRadius,
  },

  clientForm: {
    display: 'grid',
    gap: theme.spacing(3),
    gridTemplateColumns: '1fr 244px',
  },

  clientDocuments: {
    width: '244px',
    gridColumn: '-2',
    gridRow: 'span 5',
    marginTop: theme.spacing(8),
  },

  buttonsContainer: {
    display: 'grid',
    gap: '24px',
    gridTemplateColumns: 'repeat(17, 1fr)',
    alignItems: 'center',
  },

  button: {
    height: '48px',
    width: '189px',
    '&.MuiButton-root': {
      borderRadius: 12 * theme.shape.borderRadius,
    },
  },
}))
