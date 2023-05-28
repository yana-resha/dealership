import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
  },

  inputLabel: {
    '&.MuiInputLabel-root': {
      fontSize: '14px',
      lineHeight: '18px',
    },
  },

  selectField: {
    width: '100%',
    '& .MuiOutlinedInput-input': {
      padding: `${theme.spacing(1, 1, 1, 2)}`,
      backgroundColor: theme.palette.common.white,
    },
  },

  placeholder: {
    color: theme.palette.grey[500],
  },

  helperText: {
    '&.MuiFormHelperText-root': {
      marginLeft: theme.spacing(1.75),
    },
  },
}))
