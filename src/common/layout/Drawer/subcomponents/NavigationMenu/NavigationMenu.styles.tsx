import { alpha } from '@mui/material'
import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  label: {
    '& > span': {
      marginTop: theme.spacing(1),

      lineHeight: 1.25,
      color: theme.palette.text.primary,
      fontSize: 16,

      [theme.breakpoints.down('sm')]: {
        fontWeight: 400,
        color: theme.palette.text.primary,
      },
    },

    '&.MuiListItemText-root': {
      flex: 'none',
    },
  },

  itemContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectStrip: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: theme.palette.primary.main,
  },

  logoutItem: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },

  logoutBtn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 108,
    width: '100%',

    [theme.breakpoints.up('xl')]: {
      flexDirection: 'row',
      justifyContent: 'start!important',
      gap: theme.spacing(2),
      paddingLeft: theme.spacing(3) + '!important',
      minHeight: 72,
    },

    '&.MuiListItemButton-root': {
      justifyContent: 'center',
      alignItems: 'center',
    },

    '&:hover': {
      backgroundColor: `${alpha(theme.palette.primary.dark, 0.1)}`,
    },
  },

  list: {
    '&.MuiList-root': {
      marginTop: theme.spacing(4),
    },
  },

  tabs: {
    '& .MuiTabs-indicator': {
      width: 4,
    },
    '& .MuiTabs-scroller': {
      marginTop: theme.spacing(4),
    },
    '& .MuiTab-root': {
      fontSize: 16,
    },
    '& > .MuiTabScrollButton-vertical': {
      display: 'none',
    },
  },
  tab: {
    minWidth: '100%!important',

    [theme.breakpoints.up('xl')]: {
      display: 'flex',
      flexDirection: 'row!important',
      justifyContent: 'start!important',
      alignItems: 'center',
      gap: theme.spacing(2),
      paddingLeft: theme.spacing(3) + '!important',
      minHeight: 72,

      '& > .MuiTab-iconWrapper': {
        marginBottom: '0!important',
      },
    },

    '& .MuiTab-root': {
      height: 108,
      minHeight: 108,
    },
    '&.MuiTab-root': {
      textTransform: 'none',
    },
    '&:hover': {
      'background-color': `${alpha(theme.palette.primary.main, 0.1)}`,
    },
  },

  tabLabel: {
    [theme.breakpoints.down('lg')]: {
      display: 'none',
    },
  },
}))
