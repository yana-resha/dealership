import { GetAddressMapResponse } from '@sberauto/dadata-proto/public'

import { AddressMap, AddressTypeCode } from '../ClientForm.types'

function addressMapToList(map: Record<string, string> | null | undefined) {
  return Object.entries(map ?? {}).map(elm => ({ code: elm[1], name: elm[0] }))
}

export function prepareAddressMap(res: GetAddressMapResponse): AddressMap {
  return {
    ...res,
    regionTypeCodes: addressMapToList(res.regionTypeCodeMap),
    areaTypeCodes: addressMapToList(res.areaTypeCodeMap),
    cityTypeCodes: addressMapToList(res.cityTypeCodeMap),
    settlementTypeCodes: addressMapToList(res.settlementTypeCodeMap),
    streetTypeCodes: addressMapToList(res.streetTypeCodeMap),
  }
}

export function getAddressName(addressTypeCods: AddressTypeCode[] | undefined, code: string | null) {
  if (!code) {
    return ''
  }

  return (addressTypeCods || []).find(item => item.code === code)?.name ?? code ?? ''
}
