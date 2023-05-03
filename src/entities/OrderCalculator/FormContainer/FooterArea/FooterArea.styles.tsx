import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 3),
    marginTop: theme.spacing(3),
  },

  specialMarkBtn: {
    '& .MuiButton-startIcon': {
      marginLeft: theme.spacing(0.375),
      marginRight: theme.spacing(2),
    },

    '&:hover': {
      backgroundColor: 'initial' + '!important',
      '& .MuiButton-startIcon path': {
        fill: theme.palette.text.primary,
      },
    },
  },

  submitBtn: {
    height: '48px',
    width: '189px',
    '&.MuiButton-root': {
      borderRadius: 12 * theme.shape.borderRadius,
    },
  },
}))
