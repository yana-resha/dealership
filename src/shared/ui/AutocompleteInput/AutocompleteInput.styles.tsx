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
      color: theme.palette.grey[500],
      fontSize: '14px',
      lineHeight: '18px',
    },
  },

  autocompleteField: {
    width: '100%',
    '& .MuiOutlinedInput-root.MuiAutocomplete-inputRoot': {
      padding: 0,
      backgroundColor: theme.palette.common.white,
    },

    '& .MuiOutlinedInput-root .MuiOutlinedInput-input.MuiAutocomplete-input': {
      padding: `${theme.spacing(1, 0, 1, 2)}`,
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
