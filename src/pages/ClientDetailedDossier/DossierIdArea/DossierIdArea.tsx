import React from 'react'

import { Box, IconButton } from '@mui/material'
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import { ApplicationStatus } from 'entities/applications/ApplicationStatus/ApplicationStatus'
import { CustomTooltip } from 'shared/ui/CustomTooltip'
import SberTypography from 'shared/ui/SberTypography'
import { convertedDateToString } from 'shared/utils/dateTransform'

import { useStyles } from './DossierIdArea.styles'

type Props = {
  dcAppId: string
  appId?: string
  clientName: string
  passport: string
  data: string
  status: StatusCode
  onBackButton: () => void
}

export function DossierIdArea({ dcAppId, appId, clientName, passport, data, status, onBackButton }: Props) {
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

      <Box className={classes.dateContainer}>
        <CustomTooltip arrow title={<span>Дата создания заявки</span>}>
          <Box>
            <SberTypography sberautoVariant="h6" component="p" className={classes.date}>
              {convertedDateToString(new Date(data), 'dd.LL.yyyy')}
            </SberTypography>
          </Box>
        </CustomTooltip>
      </Box>
    </Box>
  )
}
