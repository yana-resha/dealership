import { IsClientRequest } from '@sberauto/loanapplifecycledc-proto/public'

export interface OrderFormData {
  passport: string
  clientName: string
  birthDate: Date | null
  phoneNumber: string
}

export type OrderData = IsClientRequest
