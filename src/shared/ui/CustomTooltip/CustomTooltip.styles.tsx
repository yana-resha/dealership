import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  tooltip: {
    display: 'flex',
    padding: theme.spacing(1) + '!important',
    fontSize: '12px!important',
    lineHeight: '14px',
    backgroundColor: theme.palette.background.default + '!important',
    color: theme.palette.text.primary + '!important',
    boxShadow: theme.shadows[3],
  },

  tooltipArrow: {
    color: theme.palette.background.default + '!important',
  },
}))
