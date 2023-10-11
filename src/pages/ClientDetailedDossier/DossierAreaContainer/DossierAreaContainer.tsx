import { Box } from '@mui/material'

import { useStyles } from './DossierAreaContainer.styles'

export function DossierAreaContainer({ children }: React.PropsWithChildren<{}>) {
  const classes = useStyles()

  return <Box className={classes.dossierAreaContainer}>{children}</Box>
}
