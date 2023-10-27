import { PhoneFrontdc } from '@sberauto/loanapplifecycledc-proto/public'

export const transformPhoneForRequest = (phone: string, type: number): PhoneFrontdc => {
  const prefix = phone[0] === '8' || phone[0] === '7' ? '7' : phone[0]

  const result = {
    type,
    countryPrefix: prefix,
    prefix: phone.slice(1, 4),
    number: phone.slice(-7),
  }

  return result
}
