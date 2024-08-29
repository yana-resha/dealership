import { Box, Typography } from '@mui/material'

import { appConfig } from 'config'
import { Page } from 'shared/ui/Page'

import { useStyles } from './Helpdesk.styles'
import { HelpdeskExample } from './HelpdeskExample/HelpdeskExample'
import { Instruction } from './Instruction/Instruction'
import { TrainingInstruction } from './TrainingInstruction/TrainingInstruction'

export function Helpdesk() {
  const classes = useStyles()

  return (
    <Page dataTestId="helpdesk">
      <Typography className={classes.pageTitle}>Поддержка</Typography>

      <Box className={classes.container}>
        {appConfig.sberTeamAuthEnv === 'training' ? (
          <TrainingInstruction />
        ) : (
          <>
            <Instruction />
            <HelpdeskExample />
          </>
        )}
      </Box>
    </Page>
  )
}
