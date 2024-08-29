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
}))
