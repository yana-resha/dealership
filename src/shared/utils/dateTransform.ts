import { DateTime } from 'luxon'

export const convertedDateToString = (date: Date | null | undefined, format?: string) =>
  date ? DateTime.fromJSDate(date).toFormat(format || 'yyyy-LL-dd') : ''

//работает со строкой формата iso yyyy-MM-dd HH:mm:ss
export const convertDateTimeToLocal = (date?: string) => {
  if (!date) {
    return null
  }
  return new Date(!/[Z]/g.test(date) ? date + 'Z' : date)
}
