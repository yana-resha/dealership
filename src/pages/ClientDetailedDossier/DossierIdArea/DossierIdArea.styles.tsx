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

  infoLine: {
    display: 'flex',
    gap: theme.spacing(1.5),
  },

  idContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  appIdNumber: {
    '&.MuiTypography-root': {
      marginTop: `-${theme.spacing(1)}`,
      color: theme.palette.text.secondary,
    },
  },

  statusContainer: {
    padding: theme.spacing(1, 0),
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
