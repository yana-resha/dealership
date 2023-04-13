import { FindApplicationsRequest } from '@sberauto/loanapplifecycledc-proto/public'

export type applicationFiltersValues = {
  findApplication: string
  applicationUpdateDate: string
  isMyApplication: boolean
}

export type FindApplicationsReq = Omit<FindApplicationsRequest, 'vendorCode' | 'birthDate' | 'phoneNumber'>
