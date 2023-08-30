import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  titleContainer: {
    gap: '8px',
    display: 'flex',
    alignItems: 'center',
  },

  iconButton: {
    height: '30px',
    width: '30px',
  },

  pageTitle: {
    '&.MuiTypography-root': {
      alignSelf: 'flex-start',
      fontSize: '32px',
      fontWeight: '600',
      lineHeight: '40px',
    },
  },

  btnContainer: {
    display: 'flex',
    gap: theme.spacing(3),
  },

  createCatalogBtn: {
    '& > .MuiButton-startIcon': {
      marginRight: theme.spacing(2),
    },
    '&:hover': {
      backgroundColor: 'transparent!important',
      textDecoration: 'underline!important',
    },
  },
}))
