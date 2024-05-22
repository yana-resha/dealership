import { IsClientRequest } from '@sberauto/loanapplifecycledc-proto/public'

export interface OrderFormData {
  passport: string
  clientFirstName: string
  clientLastName: string
  clientMiddleName: string
  birthDate: Date | null
  phoneNumber: string
}

export type OrderData = IsClientRequest
