import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  areaContainer: {
    display: 'grid',
    width: '100%',
    gap: theme.spacing(3),
    gridTemplateColumns: '1fr',
    alignItems: 'center',
  },

  documentsBlock: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: theme.spacing(3),
    overflow: 'hidden',
  },
}))
