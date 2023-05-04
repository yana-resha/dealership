import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  gridContainer: {
    gap: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(16, minmax(0, 1fr))',
    transition: theme.transitions.create([]),
  },

  areaLabel: {
    '&.MuiTypography-root': {
      fontSize: '25px',
      fontWeight: '600',
      lineHeight: theme.spacing(4),
    },
  },

  switchesContainer: {
    display: 'flex',
    gap: theme.spacing(3),
  },

  textButtonContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    cursor: 'pointer',
    color: theme.palette.primary.main,
  },

  docsUploaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
  },
}))
