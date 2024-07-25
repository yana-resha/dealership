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
    overflow: 'hidden',
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

  stack: {
    width: '100%',
  },

  item: {
    height: 40,
    width: '100%',
  },

  tooltipContainer: {
    width: 'min-content',
    height: 'min-content',
  },
}))
