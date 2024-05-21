import { maxAgeForGetCredit, MIN_AGE } from 'shared/config/client.config'

export function getMaxBirthDate() {
  const maxBirthDay = new Date()
  maxBirthDay.setFullYear(maxBirthDay.getFullYear() - MIN_AGE)

  return maxBirthDay
}

export function getMinBirthDate() {
  const minBirthDay = new Date()
  minBirthDay.setFullYear(minBirthDay.getFullYear() - maxAgeForGetCredit)

  return minBirthDay
}
