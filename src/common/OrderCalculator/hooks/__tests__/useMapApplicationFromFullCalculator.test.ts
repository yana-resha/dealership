import React from 'react'

import { renderHook } from '@testing-library/react'

import * as useGetCarsListQueryModule from 'common/OrderCalculator/hooks/useGetCarsListQuery'
import * as useGetVendorOptionsQueryModule from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { Order } from 'entities/order/model/orderSlice'
import * as orderSlice from 'entities/order/model/orderSlice'
import { fullApplicationData } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import * as useAppSelectorModule from 'shared/hooks/store/useAppSelector'
import { disableConsole } from 'tests/utils'

import { useMapApplicationFromFullCalculator } from '../useMapApplicationFromFullCalculator'
import { mockedUseGetCarsListQueryData } from './useGetCarsListQuery.mock'
import { mockedUseGetVendorOptionsQueryResponseData } from './useGetVendorOptionsQuery.mock'
import { EXPECTED_FULL_DATA } from './useInitialValues.mock'
import { EXPECTED_REMAPPED_APPLICATION } from './useMapApplicationFromFullCalculator.mock'

disableConsole('error')

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}))

const mockedUseAppSelector = jest.spyOn(useAppSelectorModule, 'useAppSelector')
const mockedUseMemo = jest.spyOn(React, 'useMemo')
const mockedUpdateApplication = jest.spyOn(orderSlice, 'updateApplication')
const mockedUseGetVendorOptions = jest.spyOn(useGetVendorOptionsQueryModule, 'useGetVendorOptionsQuery')
const mockedGetCarsList = jest.spyOn(useGetCarsListQueryModule, 'useGetCarsListQuery')

describe('useMapApplicationFromFullCalculator', () => {
  beforeEach(() => {
    mockedUseMemo.mockImplementation(fn => fn())
    mockedUseGetVendorOptions.mockImplementation(
      () =>
        ({
          data: mockedUseGetVendorOptionsQueryResponseData,
          isError: false,
        } as any),
    )
    mockedGetCarsList.mockImplementation(
      () =>
        ({
          data: mockedUseGetCarsListQueryData,
          isError: false,
        } as any),
    )
  })

  describe('Обратное преобразование данных (из формы в заявку) работает корректно', () => {
    it('Мапинг заявки полного калькулятора работает корректно', () => {
      mockedUseAppSelector.mockImplementation(() => {
        const orderData: Order = { orderData: fullApplicationData }

        return orderData
      })
      const result = renderHook(() => useMapApplicationFromFullCalculator())
      result.result.current.remapApplicationValues(EXPECTED_FULL_DATA)
      expect(mockedUpdateApplication).toBeCalledWith(EXPECTED_REMAPPED_APPLICATION)
    })
  })
})
