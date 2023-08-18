import { Button, Paper, Typography } from '@mui/material'

import { ReactComponent as DevelopmentIcon } from 'assets/icons/development.svg'

import { useStyles } from './DevelopmentCover.styles'

export function DevelopmentCover() {
  const classes = useStyles()

  return (
    <Paper className={classes.page} data-testid="developmentCover">
      <DevelopmentIcon style={{ width: 240, height: 240 }} />

      <Typography variant="h6" style={{ color: 'black' }}>
        Вот незадача... 🤔
      </Typography>
      <Typography variant="h6" style={{ color: 'black' }}>
        Страница находится в разработке
      </Typography>

      <Button variant="contained" href="/" style={{ marginTop: 16 }}>
        Вернуться на главную
      </Button>
    </Paper>
  )
}
