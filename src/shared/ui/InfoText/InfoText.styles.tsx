import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  infoTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: theme.spacing(0.75),
    alignSelf: 'start',
  },

  infoTextLabel: {
    '&.MuiTypography-root': {
      color: theme.palette.grey[500],
      lineHeight: '18px',
    },
  },
}))
