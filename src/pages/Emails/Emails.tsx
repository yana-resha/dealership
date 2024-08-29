import { Typography } from '@mui/material'

import { useGetEmailsQuery } from 'entities/email'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { Page } from 'shared/ui/Page'

import { useStyles } from './Emails.styles'
import { EmailTable } from './ui/EmailTable/EmailTable'

export function Emails() {
  const classes = useStyles()
  const { vendorCode } = getPointOfSaleFromCookies()
  const employeeId = useAppSelector(state => state.user.user?.employeeId)

  const { data, isLoading, isFetched } = useGetEmailsQuery({ vendorCode, employeeId })

  return (
    <Page dataTestId="dealershipclient.Emails">
      <Typography className={classes.pageTitle}>Входящие письма</Typography>
      <EmailTable emails={data?.emails ?? []} isLoading={isLoading} isFetched={isFetched} />
    </Page>
  )
}
