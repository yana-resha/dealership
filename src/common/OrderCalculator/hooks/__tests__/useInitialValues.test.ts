import React from 'react'

import { renderHook } from '@testing-library/react'

import { fullInitialValueMap } from 'common/OrderCalculator/config'
import * as useGetCarsListQueryModule from 'common/OrderCalculator/hooks/useGetCarsListQuery'
import * as useGetVendorOptionsQueryModule from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { Order } from 'entities/reduxStore/orderSlice'
import * as orderSlice from 'entities/reduxStore/orderSlice'
import { CAR_BRANDS } from 'shared/api/requests/dictionaryDc.mock'
import { fullApplicationData } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import * as useAppSelectorModule from 'shared/hooks/store/useAppSelector'
import { disableConsole } from 'tests/utils'

import { useInitialValues } from '../useInitialValues'
import { mockedUseGetVendorOptionsQueryResponseData } from './useGetVendorOptionsQuery.mock'
import {
  EXPECTED_FULL_DATA,
  EXPECTED_REMAPPED_BRIEF_DATA,
  EXPECTED_REMAPPED_FULL_DATA,
} from './useInitialValues.mock'

disableConsole('error')

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}))

const mockedUseAppSelector = jest.spyOn(useAppSelectorModule, 'useAppSelector')
const mockedUseMemo = jest.spyOn(React, 'useMemo')
const mockedUpdateOrder = jest.spyOn(orderSlice, 'updateOrder')
const mockedUseGetVendorOptions = jest.spyOn(useGetVendorOptionsQueryModule, 'useGetVendorOptionsQuery')
const mockedGetCarsList = jest.spyOn(useGetCarsListQueryModule, 'useGetCarsListQuery')

describe('useInitialValues', () => {
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
          data: { cars: CAR_BRANDS },
          isError: false,
        } as any),
    )
  })

  describe('Преобразование данных работает корректно', () => {
    it('Заменяет начальное значение на данные из запроса', () => {
      mockedUseAppSelector.mockImplementation(() => {
        const orderData: Order = { orderData: fullApplicationData }

        return orderData
      })
      const result = renderHook(() => useInitialValues(fullInitialValueMap, true))
      expect(result.result.current.initialValues).toEqual(EXPECTED_FULL_DATA)
      expect(result.result.current.hasCustomInitialValues).toEqual(true)
    })

    it('При отсутствии данных из запроса отдает начальные данные', () => {
      mockedUseAppSelector.mockImplementation(() => {
        const orderData: Order = { orderData: undefined }

        return orderData
      })
      const result = renderHook(() => useInitialValues(fullInitialValueMap, true))
      expect(result.result.current.initialValues.carBrand).toEqual(null)
      expect(result.result.current.initialValues.carModel).toEqual(null)
      expect(result.result.current.hasCustomInitialValues).toEqual(false)
    })
  })

  describe('Обратное преобразование данных (из формы в заявку) работает корректно', () => {
    it('Мапинг заявки полного калькулятора работает корректно', () => {
      mockedUseAppSelector.mockImplementation(() => {
        const orderData: Order = { orderData: fullApplicationData }

        return orderData
      })
      const result = renderHook(() => useInitialValues(fullInitialValueMap, true))
      result.result.current.remapApplicationValues(EXPECTED_FULL_DATA)
      expect(mockedUpdateOrder).toBeCalledWith(EXPECTED_REMAPPED_FULL_DATA)
    })

    it('Мапинг заявки короткого калькулятора работает корректно', () => {
      mockedUseAppSelector.mockImplementation(() => {
        const orderData: Order = { orderData: fullApplicationData }

        return orderData
      })
      const result = renderHook(() => useInitialValues(fullInitialValueMap))
      result.result.current.remapApplicationValues(EXPECTED_FULL_DATA)
      expect(mockedUpdateOrder).toBeCalledWith(EXPECTED_REMAPPED_BRIEF_DATA)
    })
  })
})
