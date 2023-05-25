import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  groupContainer: {
    width: '100%',
  },

  radioContainer: {
    display: 'flex',
    gap: theme.spacing(3),

    '& > .MuiFormControlLabel-root': {
      marginRight: 0,
    },
  },
}))
