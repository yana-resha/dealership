import { FindApplicationsRequest } from '@sberauto/loanapplifecycledc-proto/public'

export type FormApplicationFiltersValues = {
  findApplication: string
  applicationUpdateDate: string
  isMyApplication: boolean
}

export type FindApplicationsReq = Omit<FindApplicationsRequest, 'vendorCode' | 'birthDate' | 'phoneNumber'>
