import { ADDRESS_MAP } from '../../hooks/__tests__/useGetAddressMapQuery.mock'
import { getAddressName, prepareAddressMap } from '../addressMap'

describe('addressMap', () => {
  describe('prepareAddress', () => {
    it('Добавляются массивы словарей', () => {
      expect(
        prepareAddressMap({
          defaultRegionTypeCode: ADDRESS_MAP.defaultRegionTypeCode,
          regionTypeCodeMap: ADDRESS_MAP.regionTypeCodeMap,
          defaultAreaTypeCode: ADDRESS_MAP.defaultAreaTypeCode,
          areaTypeCodeMap: ADDRESS_MAP.areaTypeCodeMap,
          defaultCityTypeCode: ADDRESS_MAP.defaultCityTypeCode,
          cityTypeCodeMap: ADDRESS_MAP.cityTypeCodeMap,
          defaultSettlementTypeCode: ADDRESS_MAP.defaultSettlementTypeCode,
          settlementTypeCodeMap: ADDRESS_MAP.settlementTypeCodeMap,
          defaultStreetTypeCode: ADDRESS_MAP.defaultStreetTypeCode,
          streetTypeCodeMap: ADDRESS_MAP.streetTypeCodeMap,
        }),
      ).toMatchObject(ADDRESS_MAP)
    })
  })

  describe('getAddressName', () => {
    it('getAddressName работает корректно', () => {
      expect(
        getAddressName(
          [
            { code: '77', name: 'москва' },
            { code: '04', name: 'алтай' },
          ],
          '04',
        ),
      ).toEqual('алтай')
    })

    it('getAddressName работает корректно с пустым массивом', () => {
      expect(getAddressName([], '04')).toEqual('04')
    })

    it('getAddressName работает корректно с пустыми значениями', () => {
      expect(getAddressName([], null)).toEqual('')
    })
  })
})
