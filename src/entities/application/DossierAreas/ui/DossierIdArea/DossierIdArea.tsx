import React from 'react'

import { Box, IconButton } from '@mui/material'
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import { formatPassport } from 'shared/lib/utils'
import SberTypography from 'shared/ui/SberTypography'

import { ApplicationStatus } from '../../../ApplicationStatus/ApplicationStatus'
import { useStyles } from './DossierIdArea.styles'

type Props = {
  dcAppId: string
  clientName: string
  passport: string
  status: StatusCode
  onBackButton: () => void
}

export function DossierIdArea({ dcAppId, clientName, passport, status, onBackButton }: Props) {
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
