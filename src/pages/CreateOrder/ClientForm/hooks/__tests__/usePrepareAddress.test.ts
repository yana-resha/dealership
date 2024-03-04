import { renderHook } from '@testing-library/react-hooks'
import { UseQueryResult } from 'react-query'

import * as useGetAddressMapQueryModule from 'pages/CreateOrder/ClientForm/hooks/useGetAddressMapQuery'
import { MockProviders } from 'tests/mocks'

import { AddressMap } from '../../ClientForm.types'
import { usePrepareAddress } from '../usePrepareAddress'
import { ADDRESS_MAP } from './useGetAddressMapQuery.mock'
import { ADDRESS_SUGGESTION, EMPTY_PREPARED_ADDRESS, PREPARED_ADDRESS } from './usePrepareAddress.mock'

const mockedUseGetAddressMapQuery = jest.spyOn(useGetAddressMapQueryModule, 'useGetAddressMapQuery')

describe('usePrepareAddress', () => {
  beforeEach(() => {
    mockedUseGetAddressMapQuery.mockImplementation(
      () =>
        ({
          data: ADDRESS_MAP,
          isLoading: false,
        } as unknown as UseQueryResult<AddressMap, unknown>),
    )
  })
  it('Проставляются значения из словарей', () => {
    const { result } = renderHook(() => usePrepareAddress(), { wrapper: MockProviders })
    expect(result.current.prepareAddress(ADDRESS_SUGGESTION)).toMatchObject(PREPARED_ADDRESS)
  })
  it('Проставляются дефолтные значения из словарей', () => {
    const { result } = renderHook(() => usePrepareAddress(), { wrapper: MockProviders })
    expect(
      result.current.prepareAddress({
        ...ADDRESS_SUGGESTION,
        areaTypeFull: '',
        cityTypeFull: '',
        settlementTypeFull: '',
        streetTypeFull: '',
      }),
    ).toMatchObject({
      ...PREPARED_ADDRESS,
      areaType: '201',
      cityType: '301',
      settlementType: '405',
      streetType: '529',
    })
  })
  it('Проставляются пустые строки, если нет значений', () => {
    const { result } = renderHook(() => usePrepareAddress(), { wrapper: MockProviders })
    expect(result.current.prepareAddress(null)).toMatchObject(EMPTY_PREPARED_ADDRESS)
  })
})
