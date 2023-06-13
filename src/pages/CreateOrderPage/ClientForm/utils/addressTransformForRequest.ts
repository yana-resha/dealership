import { AddressFrontdc } from '@sberauto/loanapplifecycledc-proto/public'

import { Address } from 'pages/CreateOrderPage/ClientForm/ClientForm.types'

export const addressTransformForRequest = (address: Address): AddressFrontdc => {
  const {
    region,
    areaType,
    area,
    cityType,
    city,
    settlementType,
    settlement,
    streetType,
    street,
    house,
    unit,
    houseExt,
    unitNum,
  } = address

  const result = {
    type: 1,
    country: 'Россия',
    // postalCode: string, //дополнить из дадаты DCB-353
    // regCode: string, //дополнить из дадаты DCB-353
    region,
    areaType,
    area,
    cityType,
    city,
    settlementType,
    settlement,
    streetType,
    street,
    house,
    houseExt,
    unit,
    unitNum,
    office: unitNum,
  }

  return result
}

export const addressTransformForForm = (address: AddressFrontdc, initialValuesMap?: Address): Address => ({
  region: address.region ?? initialValuesMap?.region ?? '',
  district: address.area ?? initialValuesMap?.district ?? '',
  city: address.city ?? initialValuesMap?.city ?? '',
  townType: address.settlementType ?? initialValuesMap?.townType ?? '',
  town: address.settlement ?? initialValuesMap?.town ?? '',
  streetType: address.streetType ?? initialValuesMap?.streetType ?? '',
  street: address.street ?? initialValuesMap?.street ?? '',
  house: address.house ?? initialValuesMap?.house ?? '',
  building: address.unit ?? initialValuesMap?.building ?? '',
  block: address.houseExt ?? initialValuesMap?.block ?? '',
  flat: address.unitNum ?? initialValuesMap?.flat ?? '',
})
