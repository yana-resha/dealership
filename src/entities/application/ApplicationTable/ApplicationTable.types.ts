import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

export type PreparedTableData = {
  applicationNumber: string
  applicationUpdateDate: string
  fullName: string
  vendorCode: string
  source: string
  decisionTerm: number | '-'
  status: StatusCode
}
