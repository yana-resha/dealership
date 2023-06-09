import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  fraudButtonContainer: {
    display: 'flex',
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
