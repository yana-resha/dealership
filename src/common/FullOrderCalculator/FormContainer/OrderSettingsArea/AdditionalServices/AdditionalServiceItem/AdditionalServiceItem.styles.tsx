import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  itemContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    paddingTop: theme.spacing(3),
    '&:not(:last-child)': {
      paddingBottom: theme.spacing(3),
      borderBottom: '1px rgba(0, 0, 0, 0.12) solid',
    },
  },

  gridContainer: {
    gap: theme.spacing(3),
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
  },

  actionContainer: {
    display: 'flex',
    gap: theme.spacing(3),
    alignItems: 'flex-end',
  },

  switchContainer: {
    marginBottom: theme.spacing(1),
  },

  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(0.5),
  },
}))