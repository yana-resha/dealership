import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  button: {
    width: '36px',
    height: '36px',
    padding: '0px!important',
    borderRadius: '4px!important',

    '&.Mui-disabled > svg > path': {
      fill: theme.palette.text.secondary + '!important',
    },
  },

  btnIcon: {
    '& path': {
      fill: theme.palette.text.primary,
    },
  },

  rotatedIcon: {
    transform: 'rotate(45deg)',
    width: '14px',
    height: '14px',
  },
}))
