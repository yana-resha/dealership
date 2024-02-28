import { useEffect } from 'react'

import { Box } from '@mui/material'

import { ReactComponent as TeamIdLogo } from 'assets/icons/teamIdLogo.svg'
import SberTypography from 'shared/ui/SberTypography'

import { useStyles } from './TrainingAuth.styles'
import { TrainingLoginForm } from './TrainingLoginForm/TrainingLoginForm'

export function TrainingAuth() {
  const classes = useStyles()

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.container}>
        <Box className={classes.logoContainer}>
          <TeamIdLogo className={classes.logo} />
        </Box>
        <Box className={classes.loginContainer}>
          <SberTypography
            className={classes.title}
            component="h1"
            sberautoVariant="body1"
            data-testid="loginFormTitle"
          >
            Ваш аккаунт
          </SberTypography>
          <SberTypography
            className={classes.subtitle}
            component="p"
            sberautoVariant="body3"
            data-testid="loginFormTitle"
          >
            С помощью Team ID
          </SberTypography>
          <TrainingLoginForm />
        </Box>
      </Box>
    </Box>
  )
}
