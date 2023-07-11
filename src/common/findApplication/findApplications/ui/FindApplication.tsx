import { useState } from 'react'

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
  const [request, setRequest] = useState<FindApplicationsReq>({
    passportSeries: '',
    passportNumber: '',
    applicationNumber: '',
    applicationUpdateDate: '',
    onlyUserApplicationsFlag: false,
    firstName: '',
    middleName: '',
    lastName: '',
    // statuses: [],
  })
  const [page, setPage] = useState(1)

  const { vendorCode } = getPointOfSaleFromCookies()

  const { data, isLoading } = useFindApplicationsQuery({ vendorCode, ...request }, { retry: false })

  const onSubmit = (values: FindApplicationsReq) => {
    const newValue = { ...values }

    setRequest(newValue)
  }

  /* TODO: DCB-387 Решили не делать до старта MVP
      const setStatuses = (statusValues: StatusCode[]) => {
        const newValue = { ...request, statuses: statusValues }

        setRequest(newValue)
      }
    */

  const getDetailedDossier = (applicationId: string, page: number) => {
    setPage(page)
    navigate(appRoutes.order(applicationId))
  }

  return (
    <>
      <ApplicationFilters onSubmitClick={onSubmit} />
      {/* TODO: DCB-387 Решили не делать до старта MVP */}
      {/* <StatusFilter onChange={setStatuses} /> */}
      <Box className={classes.divider} />
      <ApplicationTable
        data={data || []}
        isLoading={isLoading}
        onClickRow={getDetailedDossier}
        startPage={page}
      />
    </>
  )
}
