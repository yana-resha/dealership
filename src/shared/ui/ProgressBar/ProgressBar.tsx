import React from 'react'

import { Box } from '@mui/material'
import classNames from 'classnames'

import SberTypography from '../SberTypography'
import { useStyles } from './ProgressBar.styles'

type Props = {
  steps: string[]
  currentStep: number
}

export const ProgressBar = (props: Props) => {
  const classes = useStyles()
  const { steps, currentStep } = props
  const statusClasses = steps.map((value, index) =>
    classNames(classes.progressStepStatus, {
      [classes.progressStatusPassed]: index < currentStep,
      [classes.progressStatusCurrent]: index == currentStep,
    }),
  )

  return (
    <Box className={classes.progressBarContainer}>
      {steps.map((step, index) => (
        <Box className={classes.progressBarStep} key={index}>
          <Box data-testid="progressStep" className={statusClasses[index]}>
            {' '}
          </Box>
          <SberTypography sberautoVariant="body5" component="p" className={classes.progressStepLabel}>
            {step}
          </SberTypography>
        </Box>
      ))}
    </Box>
  )
}
