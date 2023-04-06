import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

export type PreparedTableData = {
  applicationNumber: string
  applicationUpdateDate: string
  fullName: string
  vendorCode: string
  source: string
  decisionTerm: string
  //NOTE: непонятно что отвечает за иконку уточнить
  isDC: boolean
  status: StatusCode
}
