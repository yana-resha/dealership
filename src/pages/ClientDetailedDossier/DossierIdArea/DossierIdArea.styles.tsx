import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  areaContainer: {
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

  dateContainer: {
    alignSelf: 'flex-start',
    marginLeft: 'auto',
    marginRight: 0,
  },

  date: {
    '&.MuiTypography-root': {
      lineHeight: 1.38,
    },
  },

  infoLine: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },

  appIdNumber: {
    '&.MuiTypography-root': {
      marginTop: `-${theme.spacing(1)}`,
      color: theme.palette.text.secondary,
    },
  },

  dossierNumber: {
    '&.MuiTypography-root': {
      fontFamily: 'SBSansText',
    },
  },

  clientName: {
    '&.MuiTypography-root': {
      fontSize: '19px',
      fontWeight: 600,
      lineHeight: theme.spacing(3),
    },
  },

  clientPassport: {
    color: theme.palette.text.secondary,
  },
}))
