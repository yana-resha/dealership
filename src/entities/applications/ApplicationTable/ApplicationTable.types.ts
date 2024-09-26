import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

export type PreparedTableData = {
  applicationNumber: string
  applicationCreatedDate: string
  fullName: string
  vendorCode: string
  source: string
  decisionTerm: number | '-'
  status: StatusCode
  applicationUpdateDate: string
}
