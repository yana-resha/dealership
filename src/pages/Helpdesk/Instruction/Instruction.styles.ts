import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },

  emailContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },

  copyingBtn: {
    width: 24,
    height: 24,

    '& svg': {
      width: 16,
      height: 16,
    },
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
