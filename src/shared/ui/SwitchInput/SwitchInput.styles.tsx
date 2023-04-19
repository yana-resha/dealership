import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },

  switch: {
    '& .MuiSwitch-track': {
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  },

  switchLabel: {
    '&.MuiInputLabel-root': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      color: theme.palette.grey[900],
    },
  },

  helperText: {
    '&.MuiFormHelperText-root': {
      marginLeft: theme.spacing(1.75),
    },
  },
}))
