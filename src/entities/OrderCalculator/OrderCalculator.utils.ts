export function getCarYears(yearsLength: number) {
  const currentYear = new Date().getFullYear()
  const years = Array.from(new Array(yearsLength), (_, index) => `${currentYear - index}`)

  return years
}
