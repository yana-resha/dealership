import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  areaWrapper: {
    display: 'grid',
    gridTemplateColumns: 'repeat(16, minmax(0, 1fr))',
    gap: theme.spacing(3),
  },

  areaContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
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

  button: {
    '&.MuiButton-root': {
      borderRadius: 12 * theme.shape.borderRadius,
      height: '48px',
      minWidth: '189px',
      fontSize: '16px',
    },
  },

  suggestContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(),

    '& .MuiTypography-root': {
      color: theme.palette.grey[500],
    },
  },

  btnIcon: {
    fill: theme.palette.icon.main,
    width: '24px',
    height: '24px',
  },

  btnContainer: {
    display: 'flex',
    alignItems: 'start',
    gap: theme.spacing(2),
  },

  uploaderContainer: {
    flexGrow: 1,
  },

  textBtn: {
    minHeight: '40px',
    '& > .MuiButton-startIcon': {
      marginRight: theme.spacing(2),
    },
    '&:hover': {
      backgroundColor: 'transparent!important',
      textDecoration: 'underline!important',
    },
  },
}))
