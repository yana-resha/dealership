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

    '&:hover .MuiSvgIcon-root': {
      borderRadius: '50%',
      backgroundColor: theme.palette.grey[100],
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

  labelContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    width: '100%',
  },

  label: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  subLabel: {
    color: theme.palette.sber.main,
  },
}))
