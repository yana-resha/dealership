import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  fraudButtonContainer: {
    display: 'flex',
    gap: theme.spacing(2),
  },

  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  },

  root: {
    '&.MuiButton-root:hover': {
      '& svg': {
        '& path': {
          fill: theme.palette.primary.main,
        },
      },
      backgroundColor: 'transparent',
      color: theme.palette.primary.main,
    },
  },

  rootActive: {
    '&.MuiButton-root': {
      '& svg': {
        '& path': {
          fill: theme.palette.status.processed,
        },
      },
      backgroundColor: 'transparent',
      color: theme.palette.status.processed,
    },
    '&.MuiButton-root:hover': {
      backgroundColor: 'transparent',
    },
  },

  cancelButton: {
    '&.MuiButton-root': {
      '& svg': {
        width: '23px',
        height: '23px',
        fill: theme.palette.grey[700],
      },
      backgroundColor: 'transparent',
    },
    '&.MuiButton-root:hover': {
      '& svg': {
        fill: theme.palette.primary.main,
      },
      backgroundColor: 'transparent',
    },
  },

  startIcon: {
    '&.MuiButton-startIcon': {
      marginLeft: theme.spacing(0.375),
      marginRight: theme.spacing(2),
    },
  },

  submitBtn: {
    marginTop: theme.spacing(1) + '!important',
    minHeight: '40px',
  },
}))
