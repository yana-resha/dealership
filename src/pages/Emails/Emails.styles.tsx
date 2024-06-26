import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(6),
    height: '100%',
    boxSizing: 'border-box',

    [theme.breakpoints.down('sm')]: {
      alignItems: 'unset',
      padding: 0,
      backgroundColor: theme.palette.background.default,
    },
  },

  pageTitle: {
    '&.MuiTypography-root': {
      marginBottom: theme.spacing(4),
      alignSelf: 'flex-start',
      fontSize: '32px',
      fontWeight: '600',
      lineHeight: '40px',
    },
  },
}))
