import { DocType } from '@sberauto/loanapplifecycledc-proto/public'

export const DOCUMENT_TYPES = [
  { label: 'Счет', value: DocType.PAYMENT_ORDER },
  { label: 'Полис', value: DocType.INSURANCE_POLICY },
  { label: 'Договор', value: DocType.CONTRACT },
  { label: 'Акт', value: DocType.ACT },
]
