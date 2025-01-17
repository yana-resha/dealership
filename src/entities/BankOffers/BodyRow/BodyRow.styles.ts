import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  bodyCell: {
    '&.MuiTableCell-root': {
      padding: theme.spacing(2, 1),
      borderBottom: 'none',
      textAlign: 'center',
    },
  },

  bodyRow: {
    '& > td:first-child': {
      paddingLeft: theme.spacing(2),
      textAlign: 'left',
    },
    '& > td:last-child': {
      paddingRight: theme.spacing(2),
    },

    '&:hover': {
      cursor: 'pointer',
      '& > *': {
        background: theme.palette.background.paper,
      },
      '& > td:first-child': {
        borderTopLeftRadius: 4 * theme.shape.borderRadius,
        borderBottomLeftRadius: 4 * theme.shape.borderRadius,
      },
      '& > td:last-child': {
        borderTopRightRadius: 4 * theme.shape.borderRadius,
        borderBottomRightRadius: 4 * theme.shape.borderRadius,
      },
    },
  },

  oldValue: {
    textDecoration: 'line-through',
  },
  newValue: {
    color: theme.palette.sber.main,
  },

  additionalIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  additionalContentContainer: {
    position: 'relative',
  },

  infoIcon: {
    position: 'absolute',
    left: 'calc(100% + 8px)',
    top: '0',
  },
}))
