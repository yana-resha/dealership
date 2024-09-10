import { Button, Paper, Typography } from '@mui/material'

import { ReactComponent as DevelopmentIcon } from 'assets/icons/development.svg'
import { Page } from 'shared/ui/Page'

export function DevelopmentCover() {
  return (
    <Page dataTestId="developmentCover">
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
    </Page>
  )
}
