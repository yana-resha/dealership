import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  blockContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },

  actionButtons: {
    display: 'flex',
    gap: theme.spacing(3),
  },

  button: {
    width: 'max-content',
  },

  docFormButton: {
    width: '215px',
  },

  financingButton: {
    width: '267px',
  },

  documentsBlock: {
    display: 'flex',
    flexDirection: 'column',
    width: 'max-content',
    gap: theme.spacing(3),
  },

  documentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },

  document: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(4),
  },

  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },

  buttonsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
  },

  textButton: {
    '&.MuiTypography-root': {
      cursor: 'pointer',
      color: theme.palette.primary.main,
      userSelect: 'none',
    },
    '&:hover': {
      '&.MuiTypography-root': {
        textDecoration: 'underline',
      },
    },
  },

  loadingMessageContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },

  loadingMessage: {
    color: theme.palette.primary.main,
  },
}))
