import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  editRequisitesBlockContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  },

  editingAreaContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: 4 * theme.shape.borderRadius,
  },

  divider: {
    '&.MuiDivider-root': {
      margin: `0 -${theme.spacing(3)} 0 -${theme.spacing(3)}`,
    },
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

  dialogButton: {
    width: '100%',
    '&.MuiButton-root': {
      borderRadius: '24px',
      height: '40px',
    },
  },
}))
