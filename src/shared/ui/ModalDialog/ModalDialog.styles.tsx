import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  dialogBlock: {
    '&.MuiPaper-root': {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(3),
      boxSizing: 'border-box',
      backgroundColor: theme.palette.background.default,
      borderRadius: 16,
      alignItems: 'baseline',
      overflow: 'visible',
      '&& > *': {
        width: '100%',
        boxSizing: 'border-box',
      },
    },
  },

  label: {
    marginBottom: theme.spacing(2),
  },

  closeButton: {
    '&.MuiIconButton-root': {
      position: 'absolute',
      right: `-${theme.spacing(4)}`,
      top: `-${theme.spacing(0.5)}`,
      '& svg path': {
        fill: theme.palette.common.white,
      },
    },
    width: '30px',
    height: '30px',
  },
}))
