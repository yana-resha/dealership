import { Box, Typography } from '@mui/material'

import { AreaContainer } from 'shared/ui/DossierAreaContainer'

import { useStyles } from './EmailBodyArea.styles'

type Props = {
  body: string | undefined
}

export function EmailBodyArea({ body }: Props) {
  const classes = useStyles()

  return (
    <AreaContainer>
      <Box className={classes.areaContainer}>
        <Typography className={classes.emailBody}>{body}</Typography>
      </Box>
    </AreaContainer>
  )
}
