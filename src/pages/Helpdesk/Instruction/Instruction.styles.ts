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
    '& span::before': {
      content: '"-"',
      marginRight: '10px',
    },

    '&:last-child': {
      marginBottom: '0!important',
    },
  },
}))
