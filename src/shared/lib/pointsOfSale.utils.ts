import { Vendor } from '@sberauto/authdc-proto/public'
import { FilterOptionsState } from '@mui/material'
import Cookies from 'js-cookie'

export function pointsOfSaleFilter(options: Vendor[], state: FilterOptionsState<Vendor>) {
  const filteredOptions = options.filter(option =>
    retrieveLabelForPointOfSale(option).toLowerCase().includes(state.inputValue.toLowerCase()),
  )

  return filteredOptions.sort((a, b) => {
    const aIndex = retrieveLabelForPointOfSale(a).toLowerCase().indexOf(state.inputValue.toLowerCase())
    const bIndex = retrieveLabelForPointOfSale(b).toLowerCase().indexOf(state.inputValue.toLowerCase())

    return aIndex - bIndex
  })
}

export function retrieveLabelForPointOfSale(option: Vendor) {
  return (
    `${option?.vendorName} ` +
    `${option?.vendorCode} ` +
    `${option?.cityName} ` +
    `${option?.streetName} ` +
    `${option?.houseNumber}`
  )
}

export function savePointOfSaleToCookies(option: Vendor | null) {
  if (option != null) {
    Cookies.set('pointOfSale', JSON.stringify(option))
  }
}
