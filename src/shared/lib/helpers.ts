import { OptionType, RequiredServiceFlag } from '@sberauto/dictionarydc-proto/public'
import { EmailStatusCode, GetEmailsResponse } from '@sberauto/emailappdc-proto/public'

export const exhaustiveCheck = (value: never) => value

export const filterDigitsFromString = (str: string) => str.replace(/[^0-9]/g, '')

export const getLocaleStringFromNumeric = (value: string | number) => {
  switch (typeof value) {
    case 'string': {
      const parsedNumber = parseInt(filterDigitsFromString(value), 10) || null

      return parsedNumber ? parsedNumber.toLocaleString('ru-RU') : ''
    }
    case 'number':
      return value.toLocaleString('ru-RU')
    default:
      return ''
  }
}

export const addSuffix = (value: number | string, suffix: string, nowrap: boolean = false) => {
  const NON_BREAKING_SPACE = '\u00A0'

  return value + (nowrap ? NON_BREAKING_SPACE : ' ') + suffix
}

export const removeSpaces = (str: string) => str.replace(/\s/g, '')

export function downloadBlob(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${fileName}.pdf`)

  document.body.appendChild(link)
  link.click()
  link.remove()
}

/** С прото проблема, бэк отправляет число, но в прото преобразуется в строку,
 * поэтому приводим к изначальному виду */
export function prepareOptionType(type: keyof typeof OptionType): OptionType | undefined {
  return OptionType[type] ?? undefined
}

/** С прото проблема, бэк отправляет число, но в прото преобразуется в строку,
 * поэтому приводим к изначальному виду */
export function prepareRequiredServiceFlag(
  type: keyof typeof RequiredServiceFlag,
): RequiredServiceFlag | undefined {
  return RequiredServiceFlag[type] ?? undefined
}

export const getLocalStorage = <T>(key: string): T | undefined => {
  const rawData = localStorage.getItem(key)
  if (rawData) {
    try {
      return JSON.parse(rawData)
    } catch {
      console.error(`json parse error by key ${key}`)

      return
    }
  }

  return
}

export const setLocalStorage = <T>(key: string, data: T) => localStorage.setItem(key, JSON.stringify(data))

export const removeLocalStorage = (key: string) => localStorage.removeItem(key)

export function prepareEmailStatus(response: GetEmailsResponse) {
  const emails = response.emails?.map(email => {
    const emailStatus = email.status
      ? prepareEmailStatusCode(email.status as unknown as keyof typeof EmailStatusCode)
      : undefined

    return {
      ...email,
      status: emailStatus,
    }
  })

  return { emails } as GetEmailsResponse
}

export function prepareEmailStatusCode(code: keyof typeof EmailStatusCode): EmailStatusCode {
  return EmailStatusCode[code] ?? EmailStatusCode.INITIAL
}
export const checkIsNumber = (val: any): val is number => typeof val === 'number' && !isNaN(val)

export const getTaxFromPercent = (price: number, taxPercent: number) =>
  (price * taxPercent) / (100 + taxPercent)
