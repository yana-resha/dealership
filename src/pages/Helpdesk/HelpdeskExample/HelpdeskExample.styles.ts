import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  exampleLabel: {
    '&.MuiTypography-root': {
      marginBottom: theme.spacing(3),
    },
  },

  helpdeskExample: {
    borderRadius: theme.spacing(1),
    cursor: 'zoom-in',
  },

  dialogBlock: {
    '&.MuiDialog-paper': {
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
  },

  largeHelpdeskExample: {
    borderRadius: theme.spacing(2),
    cursor: 'zoom-out',
    width: 'auto',
    height: 'auto',
  },
}))
