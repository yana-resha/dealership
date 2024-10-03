import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  headerCell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    gap: theme.spacing(0.5),
    '&.MuiTableCell-root': {
      padding: theme.spacing(1),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      borderBottom: 'none',
      textAlign: 'start',
      textTransform: 'uppercase',
      display: 'flex',
      gap: theme.spacing(1),
    },
  },
  icon: {
    width: theme.spacing(1),
    height: theme.spacing(1.5),
    '& path, svg': {
      fill: 'inherit',
    },
  },
  selected: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.background.default} !important`,
  },
  searchButtonRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(2, 1.5),
  },
  cancelButton: {
    '&.MuiButton-root': {
      backgroundColor: theme.palette.colors.blueGray,
      color: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.colors.blueGray,
        color: theme.palette.primary.main,
      },
    },
  },
  popover: {
    '& .MuiPaper-root': {
      backgroundColor: theme.palette.background.default,
      paddingTop: theme.spacing(0.75),
    },
  },
}))
