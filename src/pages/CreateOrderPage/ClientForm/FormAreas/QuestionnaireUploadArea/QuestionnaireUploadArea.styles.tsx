import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  uploadAreaContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(16, minmax(0, 1fr))',
  },

  uploadQuestionnaire: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
    borderRadius: 4 * theme.shape.borderRadius,
    boxShadow: `0 2px 8px ${theme.palette.grey[300]}`,
  },

  uploadInstruction: {
    color: theme.palette.grey[400],
  },

  errorMessage: {
    '&.MuiTypography-root': {
      fontSize: '12px',
    },
    color: theme.palette.error.main,
  },
}))
