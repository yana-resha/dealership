import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  textButton: {
    '&.MuiButton-root:hover': {
      backgroundColor: 'transparent',
      textDecoration: 'underline',
    },
  },

  startIcon: {
    '&.MuiButton-startIcon': {
      marginRight: theme.spacing(2),
    },
  },

  documentSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  },

  sectionInfo: {
    '&.MuiTypography-root': {
      color: theme.palette.grey[500],
    },
  },

  documentPreview: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(2),
  },

  divider: {
    '&.MuiDivider-root': {
      margin: `0 -${theme.spacing(3)} 0 -${theme.spacing(3)}`,
    },
  },
}))
