import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  formContainer: {
    height: '100%',
    width: '100%',
    boxSizing: 'border-box',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(5),

    borderRadius: 4 * theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
  },

  formContainerWithShadow: {
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    backgroundColor: 'initial',
  },

  orderForm: {
    gap: theme.spacing(3),
    display: 'grid',
    gridTemplateColumns: 'repeat(25, 1fr)',
  },

  formTitleContainer: {
    display: 'flex',
    alignItems: 'center',
  },

  formTitleIcon: {
    marginRight: theme.spacing(3),
  },

  formTitle: {
    '&.MuiTypography-root': {
      fontSize: '25px',
      fontWeight: '600',
      lineHeight: '32px',
    },
  },

  formTitleSmall: {
    '&.MuiTypography-root': {
      fontSize: '19px',
      fontWeight: '600',
      lineHeight: '24px',
    },
  },

  clientDocuments: {
    width: '244px',
    gridColumn: '-2',
    gridRow: 'span 5',
    marginTop: theme.spacing(8),
  },

  headerContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing(3),
  },

  warningContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    color: theme.palette.status.processed,

    '& svg': {
      fill: theme.palette.status.processed,
    },
  },

  button: {
    height: '48px',
    width: '189px',
    '&.MuiButton-root': {
      borderRadius: 12 * theme.shape.borderRadius,
    },
  },
}))
