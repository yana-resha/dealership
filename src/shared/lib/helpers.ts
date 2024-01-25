import { OptionID, OptionType } from '@sberauto/dictionarydc-proto/public'

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
export function prepareOptionId(type: keyof typeof OptionID): OptionID | undefined {
  return OptionID[type] ?? undefined
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
