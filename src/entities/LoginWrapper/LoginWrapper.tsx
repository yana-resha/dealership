import { PropsWithChildren } from 'react'

import { Box } from '@mui/material'

import SberTypography from 'shared/ui/SberTypography'

import { useStyles } from './LoginWrapper.styles'

type Props = {
  title: string
  subtitle?: string
  logo: React.ReactNode
}

export function LoginWrapper({ title, subtitle, logo, children }: PropsWithChildren<Props>) {
  const classes = useStyles()

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.container}>
        <Box className={classes.logoContainer}>{logo}</Box>
        <Box className={classes.loginContainer}>
          <Box className={classes.titleContainer}>
            <SberTypography
              className={classes.title}
              component="h1"
              sberautoVariant="body1"
              data-testid="loginFormTitle"
            >
              {title}
            </SberTypography>
            {!!subtitle && (
              <SberTypography
                className={classes.subtitle}
                component="p"
                sberautoVariant="body3"
                data-testid="loginFormTitle"
              >
                {subtitle}
              </SberTypography>
            )}
          </Box>

          {children}
        </Box>
      </Box>
    </Box>
  )
}
