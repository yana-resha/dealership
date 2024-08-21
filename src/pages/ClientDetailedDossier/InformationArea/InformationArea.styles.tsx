import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  blockContainer: {
    display: 'grid',
    width: '100%',
    gap: theme.spacing(3),
    gridTemplateColumns: 'repeat(7, 1fr)',
    alignItems: 'center',
  },

  actionsContainer: {
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    gap: theme.spacing(3),
  },

  infoTextContainer: {
    alignSelf: 'start',
    minWidth: 'min-content',
  },

  textButtonContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    alignSelf: 'center',
    userSelect: 'none',
  },

  errorTextContainer: {
    color: theme.palette.error.main,
  },

  sendEmailBtn: {
    '&.MuiButton-root:hover': {
      backgroundColor: 'transparent',
      '& .MuiTypography-root': {
        textDecoration: 'underline',
      },
    },
    '& .MuiButton-startIcon': {
      marginLeft: 0,
      marginRight: theme.spacing(2),
    },
  },

  sendEmailBtnIcon: {
    width: '21px',
    fill: theme.palette.icon.main,
  },

  warningTextContainer: {
    color: theme.palette.sber.warning,
  },
}))
