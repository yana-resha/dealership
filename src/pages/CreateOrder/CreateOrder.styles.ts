import { makeStyles } from '@mui/styles'

const STEP_ICON_SIZE = 40

export const useStyles = makeStyles(theme => ({
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
  },

  pageTitle: {
    '&.MuiTypography-root': {
      marginBottom: theme.spacing(4),
      alignSelf: 'flex-start',
      fontSize: '32px',
      fontWeight: '600',
      lineHeight: '40px',
    },
  },

  stepContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    justifyContent: 'space-between',
    width: '100%',
  },

  step: {
    cursor: 'pointer',

    '&.MuiStep-root': {
      padding: 0,
      marginRight: theme.spacing(4),
    },

    '& .MuiStepLabel-iconContainer': {
      paddingRight: theme.spacing(2),
    },

    '& .MuiSvgIcon-root, .MuiStepLabel-iconContainer.Mui-active .MuiSvgIcon-root': {
      boxSizing: 'border-box',
      width: STEP_ICON_SIZE,
      height: STEP_ICON_SIZE,
      color: theme.palette.colors.white,
      border: `2px solid ${theme.palette.primary.main}`,
      borderRadius: STEP_ICON_SIZE,
      '& .MuiStepIcon-text': {
        fill: theme.palette.primary.main,
      },
    },
  },

  currentStep: {
    '& .MuiSvgIcon-root, .MuiStepLabel-iconContainer.Mui-active .MuiSvgIcon-root': {
      color: theme.palette.primary.main,
      border: 'none',
      '& .MuiStepIcon-text': {
        fill: theme.palette.colors.white,
      },
    },
  },

  skipBtn: {
    height: '48px',
    width: '189px',
    '&.MuiButton-root': {
      borderRadius: 12 * theme.shape.borderRadius,
      marginRight: theme.spacing(3),
    },
  },

  skipBtnIcon: {
    fill: theme.palette.primary.main,
    transform: 'rotate(180deg)',
  },
}))
