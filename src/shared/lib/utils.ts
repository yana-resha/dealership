import camelcaseKeys from 'camelcase-keys'
import compact from 'lodash/compact'
import snakecaseKeys from 'snakecase-keys'

export function transformRequestData(requestData: any) {
  if (typeof requestData === 'object') {
    return snakecaseKeys(requestData, { deep: true })
  }

  return requestData
}

export function transformResponseData(responseData: any) {
  if (typeof responseData === 'object') {
    return camelcaseKeys(responseData, { deep: true })
  }

  return responseData
}

export function formatNumber(num: number | string, options?: { postfix?: string; digits?: number }) {
  const { postfix, digits } = options || {}
  const postfixStr = postfix ? `${postfix}` : ''

  if (typeof num === 'string' && !num.trim()) {
    return num.trim()
  }
  const params =
    typeof digits !== undefined
      ? {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        }
      : undefined

  return new Intl.NumberFormat('ru-RU', params).format(+num) + postfixStr
}

export function formatMoney(number?: number) {
  if (typeof number !== 'number' || isNaN(number)) {
    return ''
  }

  return formatNumber(number, { postfix: ' ₽' })
}

function getPluralForm(forms: string[], num: number) {
  return num % 10 === 1 && num % 100 !== 11
    ? forms[0]
    : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
    ? forms[1]
    : forms[2]
}

export function formatTerm(term?: number) {
  if (typeof term !== 'number' || isNaN(term)) {
    return ''
  }

  return `${term} ${getPluralForm(['месяц', 'месяца', 'месяцев'], term)}`
}

export function formatPassport(series?: string, number?: string) {
  const nameArr = [series?.slice(0, 4), number]

  return compact(nameArr).join(' ')
}

type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : S

type KeysToSnakeCase<T> = {
  [K in keyof T as CamelToSnakeCase<string & K>]: T[K]
}

/** Нормализуем формат данных в тот, что на сервере (в змеиную) ({userId: 1} => {user_id: 1}) */
export const toSnakeCaseKeysData = <T extends object>(data: T): KeysToSnakeCase<T> => {
  if (typeof data !== 'object') {
    throw new Error('data is not object')
  }

  return snakecaseKeys(data, { deep: true }) as KeysToSnakeCase<T>
}

type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S

type KeysToCamelCase<T> = {
  [K in keyof T as SnakeToCamelCase<K & string>]: KeysToCamelCase<T[K]>
}

/** Нормализуем формат данных в тот, что у нас (в верблюжий) ({user_id: 1} => {userId: 1}) */
export const toCamelcaseKeysData = <T extends object>(data: T): KeysToCamelCase<T> => {
  if (typeof data !== 'object') {
    throw new Error('data is not object')
  }

  return camelcaseKeys(data, { deep: true }) as KeysToCamelCase<T>
}

/** Возвращаем строку адреса без индекса */
export const transformAddress = (address: string): string => {
  if (address.length >= 6) {
    const re = /((^\d{6,6}[ .,;])|(^\d{6,6}$)|([ .,;]\d{6,6}$)|([ .,;]\d{6,6}[ .,;]))/gm

    return address
      .replace(re, '')
      .split(',')
      .map(el => el.trim())
      .filter(el => el.length > 0)
      .join(', ')
  }

  return address
}
