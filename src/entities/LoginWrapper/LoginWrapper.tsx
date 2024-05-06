import { PropsWithChildren } from 'react'

import { Box, IconButton } from '@mui/material'

import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import SberTypography from 'shared/ui/SberTypography'

import { useStyles } from './LoginWrapper.styles'

type Props = {
  title: string
  subtitle?: string
  logo: React.ReactNode
  onBack?: () => void
}

export function LoginWrapper({ title, subtitle, logo, children, onBack }: PropsWithChildren<Props>) {
  const classes = useStyles()

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.container}>
        <Box className={classes.logoContainer}>{logo}</Box>
        <Box className={classes.loginContainer}>
          <Box className={classes.titleWrapper}>
            {!!onBack && (
              <IconButton data-testid="backBtn" className={classes.iconButton} onClick={onBack}>
                <KeyboardArrowLeft />
              </IconButton>
            )}

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
          </Box>

          {children}
        </Box>
      </Box>
    </Box>
  )
}
