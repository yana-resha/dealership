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
      fontSize: '14px',
      lineHeight: '18px',
    },
  },

  textField: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.common.white,
    },

    '& .MuiOutlinedInput-input': {
      padding: theme.spacing(1, 1, 1, 2),
    },

    '& .MuiFormHelperText-root.Mui-error': {
      whiteSpace: 'pre-wrap',
    },
  },

  formHelper: {
    '&.MuiFormHelperText-root': {
      marginLeft: 14,
      marginRight: 14,
    },
  },
}))
