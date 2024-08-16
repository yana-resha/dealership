import { DateTime } from 'luxon'

export const convertedDateToString = (date: Date | null | undefined, format?: string) =>
  date ? DateTime.fromJSDate(date).toFormat(format || 'yyyy-LL-dd') : ''
