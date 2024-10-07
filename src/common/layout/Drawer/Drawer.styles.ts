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
    transition: 'width 1s',
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
    animationDuration: '1s',
  },

  '@keyframes navigationMenu': {
    from: {
      opacity: 0,
      position: 'relative',
      left: '-10%',
    },
    to: {
      opacity: 1,
      position: 'relative',
      left: 0,
    },
  },

  '@keyframes show': {
    '0%': {
      display: 'none',
      width: 0,
      transform: 'translateX(-100%) scaleX(0)',
    },

    '20%': {
      display: 'block',
      width: 0,
      transform: 'translateX(-100%) scaleX(0)',
    },

    '100%': {
      display: 'block',
      width: 'fit-content',
      transform: 'translateX(0%) scaleX(1)',
    },
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    color: 'inherit',
    gap: theme.spacing(1),
    textDecoration: 'none',
    margin: '0 auto',
    marginTop: theme.spacing(4),
    transition: 'gap 1500ms',
    [theme.breakpoints.up('lg')]: {
      marginLeft: ({ isCollapsed }) => (isCollapsed ? '' : theme.spacing(3)),
    },
  },

  logoTitleContainer: {
    overflow: 'hidden',
    display: ({ isCollapsed }) => (isCollapsed ? 'none' : 'block'),
  },

  visibleLogoTitle: {
    display: 'block',
    animationName: '$show',
    animationDuration: '1.2s',
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
