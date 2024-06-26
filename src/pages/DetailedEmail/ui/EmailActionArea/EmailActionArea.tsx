import { useCallback, useMemo } from 'react'

import { Box, Button } from '@mui/material'
import { EmailStatusCode } from '@sberauto/emailappdc-proto/public'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'

import { EmailStatus, getEmailStatus } from 'entities/email'
import { appRoutePaths, appRoutes } from 'shared/navigation/routerPath'
import { AreaContainer } from 'shared/ui/DossierAreaContainer'
import SberTypography from 'shared/ui/SberTypography/SberTypography'

import { useStyles } from './EmailActionArea.styles'

type Props = {
  status: EmailStatusCode | null | undefined
  targetApplicationId: string | undefined
  emailId: number
}

export function EmailActionArea({ status, targetApplicationId = '', emailId }: Props) {
  const classes = useStyles()
  const navigate = useNavigate()
  const emailStatus = getEmailStatus(status)
  const { enqueueSnackbar } = useSnackbar()

  const createApplication = useCallback(() => {
    navigate(appRoutePaths.createOrder, {
      state: { emailId },
    })
  }, [emailId, navigate])

  const goToTargetApplication = useCallback(() => {
    if (targetApplicationId) {
      navigate(appRoutes.order(targetApplicationId))
    } else {
      enqueueSnackbar('Данные о заявке не найдены', { variant: 'error' })
    }
  }, [enqueueSnackbar, navigate, targetApplicationId])

  const actionButton = useMemo(() => {
    switch (emailStatus) {
      case EmailStatus.INITIAL:
        return (
          <Button variant="contained" onClick={createApplication}>
            Создать заявку
          </Button>
        )
      case EmailStatus.PROCESSED:
      case EmailStatus.ANSWERED:
        return (
          <Button variant="contained" onClick={goToTargetApplication}>
            Перейти в заявку
          </Button>
        )
      default:
        return null
    }
  }, [createApplication, emailStatus, goToTargetApplication])

  return (
    <AreaContainer dataTestid="dealershipclient.DetailedEmail.EmailActionArea">
      <Box className={classes.areaContainer}>
        <SberTypography sberautoVariant="h5" component="p">
          Действие
        </SberTypography>
        {actionButton}
      </Box>
    </AreaContainer>
  )
}
