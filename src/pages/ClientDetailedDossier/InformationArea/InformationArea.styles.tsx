import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  blockContainer: {
    display: 'grid',
    width: '100%',
    gap: theme.spacing(3),
    gridTemplateColumns: 'repeat(7, 1fr)',
    alignItems: 'center',
  },

  infoTextContainer: {
    alignSelf: 'start',
    minWidth: 'min-content',
  },

  textButtonContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    alignSelf: 'center',
    userSelect: 'none',
  },

  warningTextContainer: {
    color: theme.palette.error.main,
  },
}))
