import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  container: {
    boxShadow: '0px 4px 16px 0px rgba(0, 0, 0, 0.08)',
    padding: theme.spacing(2),
    gap: theme.spacing(0.5),
    width: 'fit-content',
    display: 'column',
  },
  monthYearRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  month: {
    minWidth: theme.spacing(10),
  },
  iconButton: {
    height: theme.spacing(3.75),
    width: theme.spacing(3.75),
  },
  headerCell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    gap: theme.spacing(0.5),
    '&.MuiTableCell-root': {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      borderBottom: 'none',
      textAlign: 'start',
      textTransform: 'uppercase',
      display: 'flex',
      gap: theme.spacing(1),
    },
  },
  button: {
    '&.MuiButton-root': {
      width: theme.spacing(16.75),
      height: theme.spacing(3),
      borderRadius: theme.spacing(0.5),
      fontSize: '14px',
      color: theme.palette.colors.grayNormal,
    },
  },
  selectedButton: {
    '&.MuiButton-root': {
      backgroundColor: theme.palette.colors.blueGray,
      color: theme.palette.primary.main,
    },
  },
  dateIcon: {
    width: theme.spacing(2),
    height: theme.spacing(1.5),
    '& path, svg': {
      fill: 'inherit',
    },
  },
  icon: {
    width: theme.spacing(1),
    height: theme.spacing(1.5),
    fill: theme.palette.colors.grayNormal,
    '& path, svg': {
      fill: theme.palette.colors.grayNormal,
    },
  },
  calendar: {
    width: theme.spacing(35),
    height: theme.spacing(31),
    display: 'flex',
    justifyContent: 'center',
  },
  searchButtonRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  searchButton: {
    width: theme.spacing(11.5),
  },
  popover: {
    '& .MuiPaper-root': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))
