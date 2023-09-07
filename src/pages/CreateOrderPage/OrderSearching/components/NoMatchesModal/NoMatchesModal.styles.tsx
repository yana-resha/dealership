import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  },

  modalPaper: {
    '&.MuiPaper-root': {
      width: 378,
    },
  },

  text: {
    textAlign: 'center',
    lineHeight: '24px!important',
  },

  title: {
    lineHeight: '32px!important',
  },

  confirmBtn: {
    marginTop: theme.spacing(1) + '!important',
    minHeight: '48px!important',
  },
}))
