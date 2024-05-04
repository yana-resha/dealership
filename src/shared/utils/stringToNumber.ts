export const stringToNumber = (str: string | undefined) => {
  if (!str) {
    return undefined
  }
  const preparedNum = parseFloat(str.replace(/ /g, ''))

  return typeof preparedNum === 'number' && !isNaN(preparedNum) ? preparedNum : undefined
}
