import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  headerCell: {
    '&.MuiTableCell-root': {
      color: theme.palette.text.secondary,
      padding: theme.spacing(0),
    },
  },

  shortHeaderCell: {
    '&.MuiTableCell-root': {
      width: '10%',
    },
  },

  headerCellWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftAlignHeaderCellWrapper: {
    justifyContent: 'start',
  },

  headerCellContainer: {
    display: 'flex',
    alignItems: 'center',
    width: 'auto',
    padding: theme.spacing(1, 1.75),
    borderRadius: 4 * theme.shape.borderRadius,
  },

  leftAlignHeaderCellContainer: {
    padding: theme.spacing(1),
  },

  headerCellContainerForSort: {
    color: theme.palette.text.primary,
    position: 'relative',
    '& svg': {
      fill: theme.palette.primary.main,
    },
    '&:hover': {
      cursor: 'pointer',
      background: theme.palette.background.paper,
      color: theme.palette.primary.main,
    },
  },

  sortedHeaderCellContainer: {
    color: theme.palette.primary.main,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2.5),
    '& svg': {
      fill: theme.palette.primary.main,
    },
  },

  sortIcon: {
    position: 'absolute',
    right: `${theme.spacing(0.5)}`,
    '&.MuiSvgIcon-root': {
      height: '0.875rem',
      width: '0.875rem',
    },
  },
}))
