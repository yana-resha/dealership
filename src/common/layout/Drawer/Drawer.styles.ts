import { alpha, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

const SHORT_DRAWER_WIDTH = '80px'
const DRAWER_WIDTH = '200px'
const MAX_DRAWER_WIDTH = '240px'

type StyleProps = {
  isCollapsed: boolean
}

export const useStyles = makeStyles<Theme, StyleProps>(theme => ({
  navigationMenuDrawer: {
    position: 'relative',
    zIndex: theme.zIndex.drawer + 1,
    height: '100%',
    width: ({ isCollapsed }) => (isCollapsed ? SHORT_DRAWER_WIDTH : MAX_DRAWER_WIDTH),

    [theme.breakpoints.down('xl')]: {
      width: ({ isCollapsed }) => (isCollapsed ? SHORT_DRAWER_WIDTH : DRAWER_WIDTH),
    },

    '& .MuiDrawer-paper': {
      height: '100%',
      position: 'relative',
      background: theme.palette.background.default,
      'border-right': 0,
      overflow: 'visible',
    },
    '&.MuiDrawer-docked': {
      height: '100%',
    },

    animationName: '$navigationMenu',
    animationDuration: '1.5s',
  },

  '@keyframes navigationMenu': {
    from: {
      marginLeft: '-100%',
      opacity: 0,
    },
    to: {
      marginLeft: 0,
      opacity: 1,
    },
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: 'inherit',
    textDecoration: 'none',
    margin: '0 auto',
    marginTop: theme.spacing(4),

    [theme.breakpoints.up('lg')]: {
      marginLeft: ({ isCollapsed }) => (isCollapsed ? '' : theme.spacing(3)),
    },
  },

  logoTitle: {
    display: ({ isCollapsed }) => (isCollapsed ? 'none' : 'block'),
  },

  switchMenuBtn: {
    '&.MuiButton-root': {
      position: 'absolute',
      right: '-16px',
      bottom: 120,
      width: 32,
      minWidth: 32,
      height: 32,
      padding: 0,
      backgroundColor: theme.palette.background.default,
      boxShadow: `0 0 5px ${alpha(theme.palette.primary.main, 0.2)}`,

      '&:hover, &:focus': {
        backgroundColor: theme.palette.background.paper,
      },
    },
  },

  switchMenuBtnIcon: {
    transform: ({ isCollapsed }) => (isCollapsed ? 'rotate(180deg)' : 'none'),
  },
}))
