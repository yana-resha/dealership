import { maxAgeForGetCredit, MIN_AGE } from 'shared/config/client.config'

export function clientNameIsCorrect(value: string | undefined) {
  if (value == undefined) {
    return false
  }
  const nameParts = value.trim().split(' ')
  // ФИО может быть без отчества
  if (nameParts.length >= 2 && nameParts.length <= 3) {
    return true
  }

  return false
}

export function clientNameIsCorrectOptional(value: string | undefined) {
  if (value == undefined || value == '') {
    return true
  }

  return clientNameIsCorrect(value)
}

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
