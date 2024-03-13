import { AddressMap } from '../../ClientForm.types'

export const ADDRESS_MAP: AddressMap = {
  defaultRegionTypeCode: {
    typeName: 'Москва',
    code: '77',
  },
  regionTypeCodeMap: {
    адыгея: '01',
    алтай: '04',
    москва: '77',
  },
  defaultAreaTypeCode: {
    typeName: 'район',
    code: '201',
  },
  areaTypeCodeMap: {
    поселение: '201',
    район: '201',
    территория: '203',
    улус: '202',
  },
  defaultCityTypeCode: {
    typeName: 'город',
    code: '301',
  },
  cityTypeCodeMap: {
    волость: '310',
    город: '301',
    территория: '312',
  },
  defaultSettlementTypeCode: {
    typeName: 'город',
    code: '405',
  },
  settlementTypeCodeMap: {
    аал: '401',
    волость: '403',
    город: '405',
  },
  defaultStreetTypeCode: {
    typeName: 'улица',
    code: '529',
  },
  streetTypeCodeMap: {
    тракт: '527',
    тупик: '528',
    улица: '529',
  },
  regionTypeCodes: [
    {
      code: '01',
      name: 'адыгея',
    },
    {
      code: '04',
      name: 'алтай',
    },
    {
      code: '77',
      name: 'москва',
    },
  ],
  areaTypeCodes: [
    {
      code: '201',
      name: 'поселение',
    },
    {
      code: '201',
      name: 'район',
    },
    {
      code: '203',
      name: 'территория',
    },
    {
      code: '202',
      name: 'улус',
    },
  ],
  cityTypeCodes: [
    {
      code: '310',
      name: 'волость',
    },
    {
      code: '301',
      name: 'город',
    },
    {
      code: '312',
      name: 'территория',
    },
  ],
  settlementTypeCodes: [
    {
      code: '401',
      name: 'аал',
    },
    {
      code: '403',
      name: 'волость',
    },
    {
      code: '405',
      name: 'город',
    },
  ],
  streetTypeCodes: [
    {
      code: '527',
      name: 'тракт',
    },
    {
      code: '528',
      name: 'тупик',
    },
    {
      code: '529',
      name: 'улица',
    },
  ],
}
