export const stringToNumber = (num: string) => {
  const preparedNum = parseInt(num.replace(/ /g, ''), 10)

  return preparedNum ? preparedNum : undefined
}
