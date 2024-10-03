import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  cell: {
    width: theme.spacing(5),
    height: theme.spacing(4.5),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.spacing(1),
    cursor: 'pointer',
  },
  defaultCell: {
    '&:hover': {
      backgroundColor: theme.palette.colors.blueGray,
    },
  },
  selectedCell: {
    color: theme.palette.colors.white,
    backgroundColor: theme.palette.colors.grayNormal,
  },
  middleCell: {
    backgroundColor: theme.palette.colors.blueGray,
    borderRadius: 0,
  },
  firstCell: {
    color: theme.palette.colors.white,
    backgroundColor: theme.palette.colors.grayNormal,
    borderRadius: `${theme.spacing(1)} 0 0 ${theme.spacing(1)}`,
  },
  lastCell: {
    color: theme.palette.colors.white,
    backgroundColor: theme.palette.colors.grayNormal,
    borderRadius: `0 ${theme.spacing(1)} ${theme.spacing(1)} 0`,
  },
}))
