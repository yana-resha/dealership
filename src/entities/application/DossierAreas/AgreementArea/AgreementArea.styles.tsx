import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  blockContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },

  actionButtons: {
    display: 'flex',
    gap: theme.spacing(3),
  },

  button: {
    width: 'max-content',
  },

  documentsBlock: {
    display: 'flex',
    flexDirection: 'column',
    width: 'max-content',
    gap: theme.spacing(3),
  },

  document: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(7),
  },

  textButton: {
    '&.MuiTypography-root': {
      cursor: 'pointer',
      color: theme.palette.primary.main,
      userSelect: 'none',
    },
    '&:hover': {
      '&.MuiTypography-root': {
        textDecoration: 'underline',
      },
    },
  },

  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
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
}))
