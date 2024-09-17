import { alpha } from '@mui/material'
import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },

  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(8, 0, 8, 6),
    backgroundColor: theme.palette.background.default,
    boxShadow: '0px 6px 24px rgba(0, 0, 0, .15)',
    borderRadius: theme.spacing(1.25),
  },

  flexContainer: {
    display: 'flex',
    alignItems: 'center',
  },

  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: theme.spacing(3),
  },

  errorLogo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.spacing(40),
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: 'inherit',
    textDecoration: 'none',
    position: 'absolute',
    padding: theme.spacing(4),
  },

  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: theme.spacing(3),
  },

  button: {
    '&.MuiButton-root': {
      width: theme.spacing(6),
      height: theme.spacing(6),
      padding: 0,
      backgroundColor: theme.palette.background.default,
      boxShadow: `0 0 5px ${alpha(theme.palette.primary.main, 0.2)}`,

      '&:hover, &:focus': {
        backgroundColor: theme.palette.background.paper,
      },
    },
  },
}))
