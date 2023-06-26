import { AddressFrontdc } from '@sberauto/loanapplifecycledc-proto/public'
import { AddressType } from '@sberauto/loanapplifecycledc-proto/public'

import { Address } from 'pages/CreateOrderPage/ClientForm/ClientForm.types'

export const addressTransformForRequest = (address: Address, addressType: AddressType): AddressFrontdc => {
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
    type: addressType,
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
  area: address.area ?? initialValuesMap?.area ?? '',
  areaType: address.areaType ?? initialValuesMap?.areaType ?? '',
  city: address.city ?? initialValuesMap?.city ?? '',
  cityType: address.cityType ?? initialValuesMap?.cityType ?? '',
  settlementType: address.settlementType ?? initialValuesMap?.settlementType ?? '',
  settlement: address.settlement ?? initialValuesMap?.settlement ?? '',
  streetType: address.streetType ?? initialValuesMap?.streetType ?? '',
  street: address.street ?? initialValuesMap?.street ?? '',
  house: address.house ?? initialValuesMap?.house ?? '',
  unit: address.unit ?? initialValuesMap?.unit ?? '',
  houseExt: address.houseExt ?? initialValuesMap?.houseExt ?? '',
  unitNum: address.unitNum ?? initialValuesMap?.unitNum ?? '',
})
