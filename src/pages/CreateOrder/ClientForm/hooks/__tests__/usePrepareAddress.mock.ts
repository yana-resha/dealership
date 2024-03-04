import { DataGetAddressSuggestions } from '@sberauto/dadata-proto/public'

export const ADDRESS_SUGGESTION: DataGetAddressSuggestions = {
  postalCode: '427780',
  regionKladrId: '7100000000000',
  regionWithType: 'Тульская обл',
  area: 'Можгинский',
  areaTypeFull: 'территория',
  city: 'Тула',
  cityTypeFull: 'волость',
  house: '6/2',
  block: '2',
  settlement: 'Пычас',
  settlementTypeFull: 'аал',
  street: 'Тимирязева',
  streetTypeFull: 'тупик',
  flat: '1',
}

export const PREPARED_ADDRESS = {
  postalCode: '427780',
  regCode: '71',
  region: 'Тульская обл',
  area: 'Можгинский',
  areaType: '203',
  city: 'Тула',
  cityType: '310',
  house: '6/2',
  houseExt: '2',
  settlement: 'Пычас',
  settlementType: '401',
  street: 'Тимирязева',
  streetType: '528',
  unitNum: '1',
}

export const EMPTY_PREPARED_ADDRESS = {
  postalCode: '',
  regCode: '',
  region: '',
  area: '',
  areaType: '',
  city: '',
  cityType: '',
  house: '',
  houseExt: '',
  settlement: '',
  settlementType: '',
  street: '',
  streetType: '',
  unitNum: '',
}
