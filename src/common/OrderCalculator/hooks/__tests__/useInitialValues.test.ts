import React from 'react'

import { renderHook } from '@testing-library/react'

import { fullInitialValueMap } from 'common/OrderCalculator/config'
import * as useGetCarsListQueryModule from 'common/OrderCalculator/hooks/useGetCarsListQuery'
import * as useGetVendorOptionsQueryModule from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { CAR_BRANDS } from 'shared/api/requests/dictionaryDc.mock'
import { fullApplicationData } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import * as useAppSelectorModule from 'shared/hooks/store/useAppSelector'
import { disableConsole } from 'tests/utils'

import { useInitialValues } from '../useInitialValues'
import { mockedUseGetVendorOptionsQueryResponseData } from './useGetVendorOptionsQuery.mock'
import { EXPECTED_FULL_DATA } from './useInitialValues.mock'

disableConsole('error')

const mockedUseAppSelector = jest.spyOn(useAppSelectorModule, 'useAppSelector')
const mockedUseMemo = jest.spyOn(React, 'useMemo')
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
      mockedUseAppSelector.mockImplementation(() => ({ ...fullApplicationData.application }))
      const result = renderHook(() => useInitialValues(fullInitialValueMap, true))
      expect(result.result.current.initialValues).toEqual(EXPECTED_FULL_DATA)
      expect(result.result.current.hasCustomInitialValues).toEqual(true)
    })

    it('При отсутствии данных из запроса отдает начальные данные', () => {
      mockedUseAppSelector.mockImplementation(() => ({}))
      const result = renderHook(() => useInitialValues(fullInitialValueMap, true))
      expect(result.result.current.initialValues.carBrand).toEqual(null)
      expect(result.result.current.initialValues.carModel).toEqual(null)
      expect(result.result.current.hasCustomInitialValues).toEqual(false)
    })
  })
})
