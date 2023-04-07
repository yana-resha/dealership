import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  page: {
    // NOTE: При display: flex ломается ресайз окна в браузере Сафари.
    // Содердимое сжимается при уменьшении экрана, но не расширяется обратно при его увеличении.
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',
    padding: theme.spacing(7, 6),

    [theme.breakpoints.down('sm')]: {
      alignItems: 'unset',
      padding: 0,
      backgroundColor: theme.palette.background.default,
    },
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
  },
}))
