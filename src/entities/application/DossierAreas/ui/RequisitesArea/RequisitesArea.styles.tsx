import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  requisitesBlock: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: theme.spacing(3),
  },

  requisiteContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },

  requisitesLine: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(6),
    gap: theme.spacing(22),
  },

  requisiteInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: theme.spacing(3),
  },

  requisiteElement: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },

  textButton: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    width: 'max-content',
    '&:hover': {
      '&.MuiTypography-root': {
        textDecoration: 'underline',
      },
    },
  },
}))
