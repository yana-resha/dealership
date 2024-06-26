import { useCallback, useMemo } from 'react'

import { Box, Button } from '@mui/material'
import cx from 'classnames'
import { useNavigate, useParams } from 'react-router-dom'

import { useGetEmailsQuery } from 'entities/email'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { appRoutes } from 'shared/navigation/routerPath'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import SberTypography from 'shared/ui/SberTypography'

import { useStyles } from './DetailedEmail.styles'
import { EmailActionArea } from './ui/EmailActionArea/EmailActionArea'
import { EmailBodyArea } from './ui/EmailBodyArea/EmailBodyArea'
import { EmailFilesArea } from './ui/EmailFilesArea/EmailFilesArea'
import { EmailInfoArea } from './ui/EmailInfoArea/EmailInfoArea'

export function DetailedEmail() {
  const classes = useStyles()
  const navigate = useNavigate()
  const { emailId = '' } = useParams()
  const { vendorCode } = getPointOfSaleFromCookies()
  const employeeId = useAppSelector(state => state.user.user?.employeeId)

  const { data, isLoading, isError } = useGetEmailsQuery({ vendorCode, employeeId })

  const currentEmail = useMemo(() => data?.emailsMap[emailId], [emailId, data?.emailsMap])

  const onBackButton = useCallback(() => {
    navigate(appRoutes.emailList())
  }, [navigate])

  return (
    <div className={classes.page} data-testid="dealershipclient.DetailedEmail">
      {isLoading && (
        <Box className={classes.circular}>
          <CircularProgressWheel size="large" />
        </Box>
      )}

      {(isError || !currentEmail) && (
        <Box className={classes.container}>
          <SberTypography sberautoVariant="body3" component="p">
            Ошибка. Не удалось получить данные о письме
          </SberTypography>
          <Button
            variant="text"
            onClick={onBackButton}
            data-testid="dealershipclient.DetailedEmail.BackButton"
          >
            Вернутся назад
          </Button>
        </Box>
      )}

      {!isLoading && !isError && !!currentEmail && (
        <Box
          className={cx(classes.container, classes.emailContainer)}
          data-testid="dealershipclient.DetailedEmail.EmailContainer"
        >
          <EmailInfoArea
            onBackButton={onBackButton}
            topic={currentEmail.topic}
            from={currentEmail.from}
            receivedAt={currentEmail.receivedAt}
          />
          <EmailBodyArea body={currentEmail.body} />
          <EmailFilesArea files={currentEmail.attachedFiles} />
          <EmailActionArea
            status={currentEmail.status}
            targetApplicationId={currentEmail.dcAppId}
            emailId={currentEmail.emailId}
          />
        </Box>
      )}
    </div>
  )
}
