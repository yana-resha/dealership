import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '& > form': {
      width: '100%',
    },
  },
  gridContainer: {
    gap: theme.spacing(3),
    display: 'grid',
    gridTemplateColumns: '1fr',
  },
  submitBtn: {
    '&.MuiButton-root': {
      height: '48px',
      marginTop: theme.spacing(5),
    },
  },
}))
