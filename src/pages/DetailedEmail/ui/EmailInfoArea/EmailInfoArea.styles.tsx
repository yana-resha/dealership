import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  areaContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },

  iconButton: {
    height: '30px',
    width: '30px',
  },

  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
  },

  emailTopic: {
    '&.MuiTypography-root': {
      alignSelf: 'flex-start',
      fontSize: '32px',
      fontWeight: '600',
      lineHeight: '40px',
    },
  },

  emailInfo: {
    display: 'flex',
    gap: theme.spacing(1),
  },

  from: {
    '&.MuiTypography-root': {
      alignSelf: 'flex-start',
      fontSize: '24px',
      fontWeight: '400',
    },
  },

  receivedAt: {
    '&.MuiTypography-root': {
      alignSelf: 'flex-start',
      fontSize: '24px',
      fontWeight: '400',
    },
    color: theme.palette.text.secondary,
  },
}))
