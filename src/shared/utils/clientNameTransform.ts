import compact from 'lodash/compact'

export function getFullName(firstStr?: string, secondStr?: string, thirdStr?: string) {
  const nameArr = [firstStr, secondStr, thirdStr]

  return compact(nameArr).join(' ')
}

export function getSplittedName(clientName?: string) {
  if (!clientName?.trim?.()) {
    return {}
  }

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
