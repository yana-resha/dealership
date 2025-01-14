import { Box } from '@mui/material'

import { useStyles } from './AreaContainer.styles'

export function AreaContainer({ dataTestid, children }: React.PropsWithChildren<{ dataTestid?: string }>) {
  const classes = useStyles()

  return (
    <Box className={classes.areaContainer} data-testid={dataTestid}>
      {children}
    </Box>
  )
}
