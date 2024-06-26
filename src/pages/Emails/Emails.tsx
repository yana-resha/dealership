import { useCallback, useState } from 'react'

import { Typography } from '@mui/material'

import { useGetEmailsQuery } from 'entities/email'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

import { useStyles } from './Emails.styles'
import { EmailTable } from './ui/EmailTable/EmailTable'

export function Emails() {
  const classes = useStyles()
  const { vendorCode } = getPointOfSaleFromCookies()
  const employeeId = useAppSelector(state => state.user.user?.employeeId)
  const [startPage, setStartPage] = useState(1)

  const { data, isLoading } = useGetEmailsQuery({ vendorCode, employeeId })

  const changeStartPage = useCallback((page: number) => {
    setStartPage(page)
  }, [])

  return (
    <div className={classes.page} data-testid="dealershipclient.Emails">
      <Typography className={classes.pageTitle}>Входящие письма</Typography>
      <EmailTable
        changeStartPage={changeStartPage}
        emails={data?.emails ?? []}
        isLoading={isLoading}
        startPage={startPage}
      />
    </div>
  )
}
