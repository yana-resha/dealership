import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  gridContainer: {
    gap: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(17, 1fr)',
    transition: theme.transitions.create([]),
  },

  areaLabel: {
    '&.MuiTypography-root': {
      fontSize: '25px',
      fontWeight: '600',
      lineHeight: theme.spacing(4),
    },
  },

  textButtonContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    cursor: 'pointer',
    color: theme.palette.primary.main,
  },

  attachFileIcon: {
    transform: 'rotate(45deg)',
  },

  switchConfirm: {
    gridColumn: 'span 5',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('lg')]: {
      gridColumn: 'span 16',
      marginTop: 0,
    },
  },
}))
