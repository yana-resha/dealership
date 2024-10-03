import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    minHeight: theme.spacing(4),
    width: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    width: '100%',
    marginTop: theme.spacing(2),
    flexWrap: 'wrap',
  },
  button: {
    '&.MuiButton-root': {
      backgroundColor: theme.palette.colors.blueGray,
      color: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.colors.blueGray,
        color: theme.palette.primary.main,
      },
    },
  },
}))
