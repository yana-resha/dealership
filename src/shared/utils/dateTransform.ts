import { DateTime } from 'luxon'

export const convertedDateToString = (date: Date | null) =>
  date ? DateTime.fromJSDate(date).toFormat('yyyy-LL-dd') : ''
