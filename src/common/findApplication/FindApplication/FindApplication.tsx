import { useState } from 'react'

import { FindApplicationsRequest } from '@sberauto/loanapplifecycledc-proto/public'

import { useFindApplicationsQuery } from 'common/findApplication/FindApplication/FindApplication.api'
import { ApplicationFilters } from 'entities/application/ApplicationFilters/ApplicationFilters'
import { ApplicationTable } from 'entities/application/ApplicationTable/ApplicationTable'
import { getPointOfSaleFromCookies } from 'shared/utils/getPointOfSaleFromCookies'

import { PreparedTableData } from '../../../entities/application/ApplicationTable/ApplicationTable.types'

export const FindApplication = () => {
  const { vendorCode } = getPointOfSaleFromCookies()
  const [request, setRequest] = useState<Omit<FindApplicationsRequest, 'vendorCode'>>({
    passportSeries: '',
    passportNumber: '',
    applicationNumber: '',
    applicationUpdateDate: '',
    statusCodes: [],
  })
  const { error, isLoading } = useFindApplicationsQuery({ vendorCode, ...request })

  const onSubmit = (values: Omit<FindApplicationsRequest, 'vendorCode'>) => {
    setRequest(values)
  }

  return (
    <>
      <ApplicationFilters onSubmitClick={onSubmit} />
      <ApplicationTable data={(error ?? []) as PreparedTableData[]} isLoading={isLoading} />
    </>
  )
}
