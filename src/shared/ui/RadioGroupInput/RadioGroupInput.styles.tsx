import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  radioContainer: {
    display: 'flex',
    gap: theme.spacing(3),

    '& > .MuiFormControlLabel-root': {
      marginRight: 0,
    },
  },
}))
