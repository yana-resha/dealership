import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },

  switch: {
    '& .MuiSwitch-switchBase': {
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.success.light,
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        border: `6px solid ${theme.palette.common.white}`,
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.grey[300],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.7,
      },
    },
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
