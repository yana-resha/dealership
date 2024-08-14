import { DateTime, Interval } from 'luxon'

export function getCurrentWorkExperience(employmentDate: Date, createdDate: Date): number {
  const result = parseInt(
    Interval.fromDateTimes(DateTime.fromJSDate(employmentDate), DateTime.fromJSDate(createdDate))
      .toDuration(['months'])
      .toFormat('MM'),
    10,
  )

  return result || 0
}
