import { IsClientRequest } from '@sberauto/loanapplifecycledc-proto/public'

export interface OrderFormData {
  passport: string
  clientName: string
  birthDate?: Date
  phoneNumber: string
}

export type OrderData = IsClientRequest
