import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  icon: {
    width: 26,
    height: 26,
    fill: theme.palette.icon.main,
    '& path, svg': {
      fill: theme.palette.icon.main,
    },
  },

  selectedIcon: {
    fill: theme.palette.primary.main,
    '& path, svg': {
      fill: theme.palette.primary.main,
    },
  },
}))
