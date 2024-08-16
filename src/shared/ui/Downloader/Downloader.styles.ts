import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  fileLink: {
    '&.MuiLink-root': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textDecoration: 'none',
      cursor: 'pointer',
      minWidth: '30px',
      minHeight: '30px',
      width: 'fit-content',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },

  disabledFileLink: {
    cursor: 'not-allowed!important',
    color: theme.palette.text.disabled,
    '&.MuiLink-root': {
      color: theme.palette.text.disabled,
    },
    '&.MuiLink-root svg': {
      fill: theme.palette.text.disabled,
    },
    '&.MuiLink-root:hover': {
      textDecoration: 'none',
    },
  },

  contentContainer: {
    display: 'flex',
    alignSelf: 'center',
    gap: theme.spacing(2),
    alignItems: 'center',
    userSelect: 'none',
  },
}))
