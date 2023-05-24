import { useState } from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { ClientDetailedDossier } from 'common/findApplication/ClientDetailedDossier'
import { ApplicationFilters } from 'entities/application/ApplicationFilters/ApplicationFilters'
import { FindApplicationsReq } from 'entities/application/ApplicationFilters/ApplicationFilters.types'
import { ApplicationTable } from 'entities/application/ApplicationTable/ApplicationTable'
import { StatusFilter } from 'entities/application/StatusFilter/StatusFilter'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import { useFindApplicationsQuery } from '../api/requestHooks'

export const FindApplication = () => {
  const [request, setRequest] = useState<FindApplicationsReq>({
    passportSeries: '',
    passportNumber: '',
    applicationNumber: '',
    applicationUpdateDate: '',
    onlyUserApplicationsFlag: false,
    firstName: '',
    middleName: '',
    lastName: '',
    statuses: [],
  })
  const [page, setPage] = useState(1)
  const [detailedApplicationId, setDetailedApplicationId] = useState<string | undefined>(undefined)

  const { vendorCode } = getPointOfSaleFromCookies()
  const { data, isLoading } = useFindApplicationsQuery({ vendorCode, ...request })

  const onSubmit = (values: FindApplicationsReq) => {
    const newValue = { ...request, ...values }

    setRequest(newValue)
  }

  const setStatuses = (statusValues: StatusCode[]) => {
    const newValue = { ...request, statuses: statusValues }

    setRequest(newValue)
  }

  const getDetailedDossier = (applicationId: string, page: number) => {
    setPage(page)
    setDetailedApplicationId(applicationId)
  }

  const onBackButton = () => {
    setDetailedApplicationId(undefined)
  }

  return detailedApplicationId ? (
    <ClientDetailedDossier applicationId={detailedApplicationId} onBackButton={onBackButton} />
  ) : (
    <>
      <ApplicationFilters onSubmitClick={onSubmit} />
      <StatusFilter onChange={setStatuses} />
      <ApplicationTable
        data={data || []}
        isLoading={isLoading}
        onClickRow={getDetailedDossier}
        startPage={page}
      />
    </>
  )
}
