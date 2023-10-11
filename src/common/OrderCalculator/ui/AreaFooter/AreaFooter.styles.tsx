import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  submitBtn: {
    height: '48px!important',
    width: '189px',
    '&.MuiButton-root': {
      borderRadius: 12 * theme.shape.borderRadius,
    },
    marginLeft: 'auto!important',
  },
}))
