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
    width: '100%',
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
    width: '100%',
  },

  from: {
    '&.MuiTypography-root': {
      alignSelf: 'flex-start',
      fontSize: '24px',
      fontWeight: '400',
    },
  },

  messageId: {
    alignSelf: 'center',
    marginLeft: 'auto',
    '&.MuiTypography-root': {
      fontSize: '18px',
      fontWeight: '200',
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
