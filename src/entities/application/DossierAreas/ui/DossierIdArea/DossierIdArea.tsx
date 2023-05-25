import React from 'react'

import { Box, IconButton } from '@mui/material'

import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import { formatPassport } from 'shared/lib/utils'
import SberTypography from 'shared/ui/SberTypography'

import { ApplicationStatus } from '../../../ApplicationStatus/ApplicationStatus'
import { useStyles } from './DossierIdArea.styles'

type Props = {
  clientDossier: any
  onBackButton: () => void
}

export function DossierIdArea(props: Props) {
  const classes = useStyles()
  const { clientDossier, onBackButton } = props
  const { applicationNumber, clientName, passport, status } = clientDossier

  return (
    <Box className={classes.areaContainer}>
      <IconButton className={classes.iconButton} onClick={onBackButton}>
        <KeyboardArrowLeft />
      </IconButton>
      <Box className={classes.infoContainer}>
        <Box className={classes.infoLine}>
          <SberTypography sberautoVariant="h2" component="p" className={classes.dossierNumber}>
            № {applicationNumber}
          </SberTypography>
          <ApplicationStatus status={status} />
        </Box>
        <Box className={classes.infoLine}>
          <SberTypography sberautoVariant="h6" component="p">
            {clientName}
          </SberTypography>
          <SberTypography sberautoVariant="body1" component="p" className={classes.clientPassport}>
            {formatPassport(passport)}
          </SberTypography>
        </Box>
      </Box>
    </Box>
  )
}
