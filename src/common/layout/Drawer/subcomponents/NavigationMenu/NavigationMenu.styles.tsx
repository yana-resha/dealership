import { alpha, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

type StyleProps = {
  isCollapsed: boolean
}

export default makeStyles<Theme, StyleProps>(theme => ({
  label: {
    display: ({ isCollapsed }) => (isCollapsed ? 'none' : 'block'),
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.75),
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

    '&.MuiTab-root': {
      textTransform: 'none',
    },

    '&:hover': {
      'background-color': `${alpha(theme.palette.primary.main, 0.1)}`,
    },
  },

  largeTab: {
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
  },

  tabLabel: {
    display: ({ isCollapsed }) => (isCollapsed ? 'none' : 'block'),
  },

  logoutItem: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },

  logoutBtn: {
    '&.MuiButton-root': {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 72,
      width: '100%',

      [theme.breakpoints.up('xl')]: {
        flexDirection: 'row',
        justifyContent: 'start',
        gap: theme.spacing(2),
        paddingLeft: theme.spacing(3),
        minHeight: 72,
      },

      '&.MuiListItemButton-root': {
        justifyContent: 'center',
        alignItems: 'center',
      },

      '&:hover': {
        'background-color': `${alpha(theme.palette.primary.main, 0.1)}`,
      },
    },
  },
}))
