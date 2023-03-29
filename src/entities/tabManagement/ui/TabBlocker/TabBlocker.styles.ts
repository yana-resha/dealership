import { alpha } from '@mui/material'
import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  main: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `${alpha(theme.palette.background.paper, 0.9)}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  box: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 416,
    minHeight: 200,
    boxSizing: 'border-box',
    padding: theme.spacing(3),
    gap: theme.spacing(3),
    borderRadius: 4 * theme.shape.borderRadius,
    boxShadow: `0 4px 16px ${theme.palette.grey[300]}`,
    background: theme.palette.background.default,
  },
  message: {
    color: theme.palette.text.primary,
    textAlign: 'center',
  },
}))
