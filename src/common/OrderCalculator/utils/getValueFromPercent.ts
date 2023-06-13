export enum RoundOption {
  min = 'min',
  max = 'max',
}

export function getMinMaxValueFromPercent(
  percent: number | undefined,
  baseStr: string,
  option?: RoundOption,
) {
  const base = parseFloat(baseStr)
  if (!percent || isNaN(base)) {
    return undefined
  }
  switch (option) {
    case RoundOption.min:
      return Math.ceil((percent / 100) * base)
    case RoundOption.max:
      return Math.floor((percent / 100) * base)
    default:
      return Math.round((percent / 100) * base)
  }
}