export const stringToNumber = (num: string) => {
  const preparedNum = parseFloat(num.replace(/ /g, ''))

  return preparedNum ? preparedNum : undefined
}
