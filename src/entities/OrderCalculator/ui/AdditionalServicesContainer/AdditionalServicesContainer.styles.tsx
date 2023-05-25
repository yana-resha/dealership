import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  accordionContainer: {
    boxShadow: 'none!important',
    margin: 0 + '!important',
    padding: 0,

    '& > .MuiAccordionSummary-root': {
      display: 'inline-flex',
      flexDirection: 'row-reverse',
      padding: 0,
      minHeight: 'unset',

      '&.Mui-expanded': {
        minHeight: 'unset',
      },

      '&:hover': {
        color: theme.palette.primary.main,
        '& path': {
          fill: theme.palette.primary.main,
        },
      },

      '& > .MuiAccordionSummary-content.Mui-expanded, & > .MuiAccordionSummary-content': {
        margin: 0,
      },
    },

    '&.Mui-disabled': {
      backgroundColor: 'inherit!important',
    },

    '& .MuiAccordionDetails-root': {
      padding: 0,
      paddingTop: theme.spacing(3),
    },

    '& > .MuiAccordionSummary-root.Mui-expanded': {
      minHeight: '48px',
    },

    '&:not(:first-child):before': {
      display: 'none!important',
    },
  },

  summaryIcon: {
    width: '20px',
    height: '20px',
  },

  title: {
    '&.MuiTypography-root': {
      marginLeft: '18px',
    },
  },

  errorMessage: {
    '&.MuiTypography-root': {
      fontSize: '12px',
      paddingLeft: theme.spacing(4.7),
    },
    color: theme.palette.error.main,
  },
}))
