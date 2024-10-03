import { useCallback, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { ApplicationSearch } from 'entities/applications/ApplicationSearch/ApplicationSearch'
import { FindApplicationsReq } from 'entities/applications/ApplicationSearch/ApplicationSearch.types'
import { ApplicationTable } from 'entities/applications/ApplicationTable/ApplicationTable'
import { FilterInfo } from 'entities/applications/FiltersInfo/FiltersInfo'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { appRoutes } from 'shared/navigation/routerPath'

import { useApplicationFilters } from '../hooks/useApplicationFilters'
import { useFindApplicationsQuery } from '../hooks/useFindApplicationsQuery'

export const FindApplication = () => {
  const navigate = useNavigate()
  const { vendorCode } = getPointOfSaleFromCookies()

  const [request, setRequest] = useState<FindApplicationsReq>({})

  const { data, isLoading, isFetched } = useFindApplicationsQuery(
    { vendorCode, ...request },
    { retry: false },
  )

  const { isEnabled, filteredData } = useApplicationFilters(data)

  const onSubmit = useCallback((values: FindApplicationsReq) => setRequest(values), [])

  const getDetailedDossier = (applicationId: string) => {
    navigate(appRoutes.order(applicationId))
  }

  return (
    <>
      <ApplicationSearch onSubmitClick={onSubmit} />
      {isEnabled && <FilterInfo />}
      <ApplicationTable
        data={filteredData || []}
        isLoading={isLoading}
        isFetched={isFetched}
        onClickRow={getDetailedDossier}
      />
    </>
  )
}
