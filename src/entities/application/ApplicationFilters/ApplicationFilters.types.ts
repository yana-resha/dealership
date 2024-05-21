import { FindApplicationsRequest } from '@sberauto/loanapplifecycledc-proto/public'

export type FormApplicationFiltersValues = {
  findApplication: string
  lastName: string
  firstName: string
  middleName: string
  applicationUpdateDate: Date | null
  isMyApplication: boolean
}

export type FindApplicationsReq = Omit<FindApplicationsRequest, 'vendorCode' | 'birthDate' | 'phoneNumber'>
