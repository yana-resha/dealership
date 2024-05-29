import React from 'react'

import { Box, IconButton } from '@mui/material'
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import { ApplicationStatus } from 'entities/application/ApplicationStatus/ApplicationStatus'
import SberTypography from 'shared/ui/SberTypography'

import { useStyles } from './DossierIdArea.styles'

type Props = {
  dcAppId: string
  appId?: string
  clientName: string
  passport: string
  status: StatusCode
  onBackButton: () => void
}

export function DossierIdArea({ dcAppId, appId, clientName, passport, status, onBackButton }: Props) {
  const classes = useStyles()

  return (
    <Box className={classes.areaContainer}>
      <IconButton className={classes.iconButton} onClick={onBackButton}>
        <KeyboardArrowLeft />
      </IconButton>
      <Box className={classes.infoContainer}>
        <Box className={classes.infoLine}>
          <SberTypography sberautoVariant="h2" component="p" className={classes.dossierNumber}>
            № {dcAppId}
          </SberTypography>
          <ApplicationStatus status={status} />
        </Box>

        {!!appId && (
          <Box className={classes.infoLine}>
            <SberTypography sberautoVariant="body1" component="p" className={classes.appIdNumber}>
              {appId}
            </SberTypography>
          </Box>
        )}

        <Box className={classes.infoLine}>
          <SberTypography sberautoVariant="h6" component="p">
            {clientName}
          </SberTypography>
          <SberTypography sberautoVariant="body1" component="p" className={classes.clientPassport}>
            {passport}
          </SberTypography>
        </Box>
      </Box>
    </Box>
  )
}
