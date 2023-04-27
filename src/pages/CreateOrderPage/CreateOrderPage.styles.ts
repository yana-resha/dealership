import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(6),

    [theme.breakpoints.down('sm')]: {
      alignItems: 'unset',
      padding: 0,
      backgroundColor: theme.palette.background.default,
    },
  },

  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
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

  stepContainer: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing(4),
  },

  step: {
    cursor: 'pointer',

    '&.MuiStep-root': {
      padding: 0,
      marginRight: theme.spacing(4),
    },
    '& .MuiStepLabel-iconContainer': {
      paddingRight: theme.spacing(2),
    },
    '& .MuiSvgIcon-root': {
      width: '40px',
      height: '40px',
    },
    '& .MuiStepLabel-iconContainer.Mui-completed .MuiSvgIcon-root': {
      color: theme.palette.sber.main,
    },
  },
}))
