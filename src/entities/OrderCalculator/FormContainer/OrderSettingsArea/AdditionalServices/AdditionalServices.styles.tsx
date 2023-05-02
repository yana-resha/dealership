import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  accordionContainer: {
    boxShadow: 'none' + '!important',
    margin: 0 + '!important',
    padding: 0,

    '& > .MuiAccordionSummary-root': {
      display: 'inline-flex',
      flexDirection: 'row-reverse',
      padding: theme.spacing(3.5, 0, 0),

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
      backgroundColor: 'inherit' + '!important',
    },

    '&:first-child > .MuiAccordionSummary-root': {
      paddingTop: 0,
    },

    '& .MuiAccordionDetails-root': {
      padding: 0,
      paddingTop: theme.spacing(3),
    },

    '& > .MuiAccordionSummary-root.Mui-expanded': {
      minHeight: '48px',
    },

    '&:not(:first-child):before': {
      display: 'none' + '!important',
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

  itemsContaner: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
}))
