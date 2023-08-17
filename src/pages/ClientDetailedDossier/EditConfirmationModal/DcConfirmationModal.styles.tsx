import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
  },

  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },

  dialogBtn: {
    '&.MuiButton-root': {
      minWidth: 160,
      minHeight: 48,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      borderRadius: 12 * theme.shape.borderRadius,
    },
  },

  dialogText: {
    '&&.MuiDialogContentText-root': {
      color: theme.palette.text.primary,
      marginBottom: theme.spacing(1),
    },
  },
}))
