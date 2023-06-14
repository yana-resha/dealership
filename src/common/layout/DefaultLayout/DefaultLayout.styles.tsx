import { makeStyles } from '@mui/styles'

const SHORT_DRAWER_WIDTH = '80px'
const DRAWER_WIDTH = '200px'
const MAX_DRAWER_WIDTH = '240px'

export const useStyles = makeStyles(theme => ({
  globalContainer: {
    display: 'grid',
    height: '100%',
    overflow: 'hidden',

    gridTemplateColumns: `${SHORT_DRAWER_WIDTH} 1fr`,
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: `${DRAWER_WIDTH} 1fr`,
    },
    [theme.breakpoints.up('xl')]: {
      gridTemplateColumns: `${MAX_DRAWER_WIDTH} 1fr`,
    },
  },
  contentContainer: {
    height: '100%',
    overflow: 'hidden',
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,

    '&&': {
      [theme.breakpoints.down('sm')]: {
        zIndex: theme.zIndex.drawer,
      },
    },
  },
  main: {
    flexGrow: 1,
    overflow: 'auto',
    minWidth: 'min-content',
  },
}))
