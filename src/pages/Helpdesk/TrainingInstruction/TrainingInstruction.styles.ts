import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },

  listWrapper: {
    display: 'flex',
    alignItems: 'end',
  },

  listContainer: {
    padding: '0!important',
  },

  listItem: {
    '&.MuiListItemText-root': {
      marginTop: theme.spacing(2),
      marginBottom: 0,
    },

    '& span::before': {
      content: '"-"',
      marginRight: '10px',
    },

    '&:first-child': {
      marginTop: '0!important',
    },
  },
}))
