import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  progressBarContainer: {
    display: 'flex',
    width: '100%',
    gap: theme.spacing(0.25),
  },

  progressBarStep: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    flex: 1,
    '&:first-child div': {
      borderRadius: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`,
    },
    '&:last-child div': {
      borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
    },
  },

  progressStepStatus: {
    width: '100%',
    height: '8px',
    backgroundColor: theme.palette.grey[300],
  },

  progressStatusPassed: {
    backgroundColor: theme.palette.success.light,
  },

  progressStatusCurrent: {
    backgroundColor: theme.palette.primary.main,
  },

  progressStepLabel: {
    '&.MuiTypography-root': {
      color: theme.palette.grey[500],
    },
  },
}))
