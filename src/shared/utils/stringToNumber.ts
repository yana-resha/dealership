export const stringToNumber = (num: string) => {
  const preparedNum = parseInt(num, 10)

  return preparedNum ? preparedNum : undefined
}
