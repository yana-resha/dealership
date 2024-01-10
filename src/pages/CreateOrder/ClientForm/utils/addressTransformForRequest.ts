import { AddressFrontdc } from '@sberauto/loanapplifecycledc-proto/public'
import { AddressType } from '@sberauto/loanapplifecycledc-proto/public'

import { Address } from 'pages/CreateOrder/ClientForm/ClientForm.types'

export const addressTransformForRequest = (address: Address, addressType: AddressType): AddressFrontdc => {
  const {
    postalCode,
    regCode,
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
    postalCode,
    regCode: regCode ?? '',
    region,
    areaType: areaType ?? '',
    area,
    cityType: cityType ?? '',
    city,
    settlementType: settlementType ?? '',
    settlement,
    streetType: streetType ?? '',
    street,
    house,
    houseExt,
    unit,
    unitNum: addressType !== AddressType.WORKPLACE ? unitNum : undefined,
    office: addressType === AddressType.WORKPLACE ? unitNum : undefined,
  }

  return result
}

export const addressTransformForForm = (address: AddressFrontdc, initialValuesMap?: Address): Address => ({
  postalCode: address.postalCode ?? initialValuesMap?.postalCode ?? '',
  regCode: address.regCode ?? initialValuesMap?.regCode ?? '',
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
  unitNum:
    (address.type !== AddressType.WORKPLACE ? address.unitNum : address.office) ??
    initialValuesMap?.unitNum ??
    '',
})
