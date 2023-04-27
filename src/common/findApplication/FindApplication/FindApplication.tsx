import { useState } from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { useFindApplicationsQuery } from 'common/findApplication/FindApplication/FindApplication.api'
import { ApplicationFilters } from 'entities/application/ApplicationFilters/ApplicationFilters'
import { FindApplicationsReq } from 'entities/application/ApplicationFilters/ApplicationFilters.types'
import { ApplicationTable } from 'entities/application/ApplicationTable/ApplicationTable'
import { StatusFilter } from 'entities/application/StatusFilter/StatusFilter'
import { getPointOfSaleFromCookies } from 'shared/utils/getPointOfSaleFromCookies'

import { PreparedTableData } from '../../../entities/application/ApplicationTable/ApplicationTable.types'
import { ClientDetailedDossier } from '../ClientDetailedDossier'

export const FindApplication = () => {
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
    statuses: [],
  })
  const { error, isLoading } = useFindApplicationsQuery({ vendorCode, ...request })
  const [detailedApplicationId, setDetailedApplicationId] = useState<string | undefined>(undefined)
  const [page, setPage] = useState(1)

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
        data={(error ?? []) as PreparedTableData[]}
        isLoading={isLoading}
        onClickRow={getDetailedDossier}
        startPage={page}
      />
    </>
  )
}
