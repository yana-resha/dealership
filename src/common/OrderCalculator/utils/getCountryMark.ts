import { CountryMade, CountryMark } from '../types'

export function getCountryMark(countryMade: string | undefined) {
  switch (countryMade) {
    case CountryMade.Domestic:
      return CountryMark.Domestic
    case CountryMade.China:
      return CountryMark.China
    default:
      return CountryMark.Foreign
  }
}
