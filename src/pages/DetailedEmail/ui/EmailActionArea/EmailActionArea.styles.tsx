import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  areaContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    width: '100%',
    alignItems: 'flex-start',
  },
}))
