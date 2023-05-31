import compact from 'lodash/compact'

export function getFullName(firstName?: string, lastName?: string, middleName?: string) {
  const nameArr = [lastName, firstName, middleName]

  return compact(nameArr).join(' ')
}

export function getSplitedName(clientName?: string) {
  const clientNames = clientName?.trim().split(' ')
  const lastName = clientNames?.[0]
  const firstName = clientNames?.[1]
  const middleName = clientNames?.[2]

  return {
    lastName,
    firstName,
    middleName,
  }
}
