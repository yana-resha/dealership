import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  pageTitle: {
    '&.MuiTypography-root': {
      marginBottom: theme.spacing(4),
      alignSelf: 'flex-start',
      fontSize: '32px',
      fontWeight: '600',
      lineHeight: '40px',
    },
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    boxSizing: 'border-box',
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: 4 * theme.shape.borderRadius,
    gap: theme.spacing(3),
  },
}))
