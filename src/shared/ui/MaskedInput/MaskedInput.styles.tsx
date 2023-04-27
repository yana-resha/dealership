import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: theme.spacing(1),
  },

  inputLabel: {
    '&.MuiInputLabel-root': {
      color: theme.palette.grey[500],
      fontSize: '14px',
      lineHeight: '18px',
    },
  },

  textField: {
    width: '100%',
    '& .MuiOutlinedInput-input': {
      padding: `${theme.spacing(1, 1, 1, 2)}`,
      backgroundColor: theme.palette.common.white,
    },

    '& .MuiFormHelperText-root.Mui-error': {
      whiteSpace: 'pre-wrap',
    },
  },
}))