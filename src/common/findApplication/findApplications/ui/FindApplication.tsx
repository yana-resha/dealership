import { useCallback, useState } from 'react'

import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'

import { ApplicationFilters } from 'entities/application/ApplicationFilters/ApplicationFilters'
import { FindApplicationsReq } from 'entities/application/ApplicationFilters/ApplicationFilters.types'
import { ApplicationTable } from 'entities/application/ApplicationTable/ApplicationTable'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { appRoutes } from 'shared/navigation/routerPath'

import { useFindApplicationsQuery } from '../hooks/useFindApplicationsQuery'
import { useStyles } from './FindApplication.styles'

export const FindApplication = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const { vendorCode } = getPointOfSaleFromCookies()

  const [request, setRequest] = useState<FindApplicationsReq>({
    passportSeries: '',
    passportNumber: '',
    applicationNumber: '',
    applicationUpdateDate: '',
    onlyUserApplicationsFlag: false,
    firstName: '',
    middleName: '',
    lastName: '',
  })

  const { data, isLoading, isFetched } = useFindApplicationsQuery(
    { vendorCode, ...request },
    { retry: false },
  )

  const onSubmit = useCallback((values: FindApplicationsReq) => setRequest({ ...values }), [])

  const getDetailedDossier = (applicationId: string) => {
    navigate(appRoutes.order(applicationId))
  }

  return (
    <>
      <ApplicationFilters onSubmitClick={onSubmit} />
      <Box className={classes.divider} />
      <ApplicationTable
        data={data || []}
        isLoading={isLoading}
        isFetched={isFetched}
        onClickRow={getDetailedDossier}
      />
    </>
  )
}
