import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  fileDownloaderContainer: {
    overflow: 'hidden',
  },
  avatar: {
    '&.MuiAvatar-root': {
      width: 32,
      height: 32,
      backgroundColor: 'transparent',
    },
  },
  text: {
    color: theme.palette.primary.main,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  fileLink: {
    '&.MuiLink-root': {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      gap: theme.spacing(1),
      cursor: 'pointer',
      overflow: 'hidden',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    margin: 'auto',
  },
}))
