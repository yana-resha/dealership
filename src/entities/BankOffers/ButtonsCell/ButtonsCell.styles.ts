import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  btnContainer: {
    display: 'flex',
    gap: theme.spacing(2.5),
    width: '100%',
    height: '100%',
  },

  icon: {
    width: '20px',
    height: '20px',
    padding: theme.spacing(0) + '!important',
  },

  tooltip: {
    padding: theme.spacing(1) + '!important',
    maxWidth: '150px' + '!important',
    fontSize: '12px',
    lineHeight: '14px',
    backgroundColor: theme.palette.background.default + '!important',
    color: theme.palette.text.primary + '!important',
    boxShadow: theme.shadows[3],
  },

  tooltipArrow: {
    color: theme.palette.background.default + '!important',
  },
}))
