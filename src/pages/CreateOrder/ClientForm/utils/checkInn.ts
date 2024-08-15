// проверяет инн по контрольной сумме, также если инн состоит не из цифр и не равен (10 || 12) символам
//вернет false

export const checkInn = (value: string): Boolean => {
  const arNumbers: number[] = value.split('').map(el => Number(el))

  const isValidSymbol = arNumbers.every(symbol => !isNaN(symbol))
  if (!isValidSymbol) {
    return false
  }

  if (arNumbers.length === 10) {
    //каждую цифру мы умножаем на свой коэффициент
    //а потом получаем остаток от деления на 11 и на 10
    const checkSum =
      ((2 * arNumbers[0] +
        4 * arNumbers[1] +
        10 * arNumbers[2] +
        3 * arNumbers[3] +
        5 * arNumbers[4] +
        9 * arNumbers[5] +
        4 * arNumbers[6] +
        6 * arNumbers[7] +
        8 * arNumbers[8]) %
        11) %
      10

    return checkSum === Number(arNumbers[9])
  } else if (arNumbers.length === 12) {
    const checkSumOne =
      ((7 * arNumbers[0] +
        2 * arNumbers[1] +
        4 * arNumbers[2] +
        10 * arNumbers[3] +
        3 * arNumbers[4] +
        5 * arNumbers[5] +
        9 * arNumbers[6] +
        4 * arNumbers[7] +
        6 * arNumbers[8] +
        8 * arNumbers[9]) %
        11) %
      10

    const checkSumTwo =
      ((3 * arNumbers[0] +
        7 * arNumbers[1] +
        2 * arNumbers[2] +
        4 * arNumbers[3] +
        10 * arNumbers[4] +
        3 * arNumbers[5] +
        5 * arNumbers[6] +
        9 * arNumbers[7] +
        4 * arNumbers[8] +
        6 * arNumbers[9] +
        8 * arNumbers[10]) %
        11) %
      10

    //в этом случае мы проверяем 11 и 12 символы
    return checkSumOne === Number(arNumbers[10]) && checkSumTwo === Number(arNumbers[11])
  }

  return false
}
