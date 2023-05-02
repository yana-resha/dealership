import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  accordionContainer: {
    boxShadow: 'none' + '!important',
    margin: 0 + '!important',
    padding: theme.spacing(0, 3),

    '& > .MuiAccordionSummary-root': {
      padding: theme.spacing(3, 0),
      cursor: 'default' + '!important',

      '& > .MuiAccordionSummary-content.Mui-expanded, & > .MuiAccordionSummary-content': {
        margin: 0,
      },
    },

    '&:first-child > .MuiAccordionSummary-root': {
      paddingTop: 0,
    },

    '& .MuiAccordionDetails-root': {
      padding: 0,
    },

    '& > .MuiAccordionSummary-root.Mui-expanded': {
      minHeight: '48px',
    },

    '&:not(:first-child):before': {
      display: 'block' + '!important',
      opacity: 1 + '!important',
    },
  },

  title: {
    '&.MuiTypography-root': {
      fontSize: '25px',
      fontWeight: '600',
      lineHeight: theme.spacing(4),
    },
  },

  accordionIcon: {
    cursor: 'pointer',
  },
}))
