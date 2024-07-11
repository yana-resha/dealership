import React, { PropsWithChildren } from 'react'

import { Box } from '@mui/material'
import cx from 'classnames'

import SberTypography from '../SberTypography'
import { useStyles } from './InfoText.styles'

type Props = {
  label: string
  isBreakWord?: boolean
}

export function InfoText({ label, children, isBreakWord }: PropsWithChildren<Props>) {
  const classes = useStyles()

  return (
    <Box className={classes.infoTextContainer} minWidth="min-content">
      <SberTypography sberautoVariant="body5" component="p" className={classes.infoTextLabel}>
        {label}
      </SberTypography>
      <SberTypography
        sberautoVariant="body2"
        component="p"
        className={cx({ [classes.brokenInfoTextValue]: isBreakWord })}
      >
        {children}
      </SberTypography>
    </Box>
  )
}
