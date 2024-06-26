import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(theme => ({
  areaContainer: {
    width: '100%',
    alignItems: 'center',
    maxHeight: '400px',
    overflowY: 'auto',
  },

  emailBody: {
    '&.MuiTypography-root': {
      whiteSpace: 'pre-wrap',
    },
  },
}))
