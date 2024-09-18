import { useEffect } from 'react'

import HomeIcon from '@mui/icons-material/Home'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Box, Button } from '@mui/material'

import { ReactComponent as ErrorSign } from 'assets/icons/error.svg'
import { ReactComponent as SberIcon } from 'assets/icons/sberIcon.svg'
import { ReactComponent as SberLogoTitle } from 'assets/icons/sberLogoTitle.svg'
import { defaultRoute } from 'shared/navigation/routerPath'
import { CustomTooltip } from 'shared/ui/CustomTooltip'
import SberTypography from 'shared/ui/SberTypography'

import { useStyles } from './TechnicalError.styles'

export function TechnicalError() {
  const classes = useStyles()

  const handleReturnMainPage = () => {
    location.replace(defaultRoute)
  }

  const handleReloadPage = () => {
    location.reload()
  }

  // fix для корректной работы возврата на пред. страницу стрелкой в браузере или комбинацией клавиш
  useEffect(() => {
    const onPopState = () => location.reload()

    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  return (
    <>
      <Box className={classes.logo}>
        <SberIcon />
        <SberLogoTitle />
      </Box>
      <Box className={classes.container}>
        <Box className={classes.inputContainer}>
          <Box className={classes.flexContainer}>
            <Box className={classes.textContainer}>
              <SberTypography sberautoVariant="h2" component="p">
                Произошла
                <br />
                техническая ошибка
              </SberTypography>
              <SberTypography sberautoVariant="body3" component="p">
                Перезагрузите страницу.
                <br />
                Если перезагрузка не помогает -
                <br />
                обратитесь в поддержку
              </SberTypography>
              <Box className={classes.buttonContainer}>
                <CustomTooltip arrow placement="top" title={<span>Вернуться на главную</span>}>
                  <Button
                    className={classes.button}
                    onClick={handleReturnMainPage}
                    color="primary"
                    variant="outlined"
                  >
                    <HomeIcon fontSize="large" />
                  </Button>
                </CustomTooltip>
                <CustomTooltip arrow placement="top" title={<span>Обновить</span>}>
                  <Button
                    className={classes.button}
                    onClick={handleReloadPage}
                    color="primary"
                    variant="outlined"
                  >
                    <RefreshIcon fontSize="large" />
                  </Button>
                </CustomTooltip>
              </Box>
            </Box>
            <Box className={classes.errorLogo}>
              <ErrorSign />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
