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
      color: theme.palette.text.secondary,
      lineHeight: '18px',
    },
  },
  brokenInfoTextValue: {
    '&.MuiTypography-root': {
      wordBreak: 'break-word',
    },
  },
}))
