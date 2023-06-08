import { AddressFrontdc } from '@sberauto/loanapplifecycledc-proto/public'

import { Address } from 'pages/CreateOrderPage/ClientForm/ClientForm.types'

export const addressTransformForRequest = (address: Address): AddressFrontdc => {
  const { region, district, city, townType, town, streetType, street, house, building, block, flat } = address

  const result = {
    type: 1,
    country: 'Россия',
    // postalCode: string, //дополнить из дадаты DCB-353
    // regCode: string, //дополнить из дадаты DCB-353
    region,
    // areaType: string, //дополнить из дадаты DCB-353
    area: district,
    // cityType: string, //дополнить из дадаты DCB-353
    city,
    settlementType: townType,
    settlement: town,
    streetType,
    street,
    house,
    houseExt: block,
    unit: building,
    unitNum: flat,
    office: flat,
  }

  return result
}
