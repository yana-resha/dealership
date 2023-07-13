import React from 'react'

import { renderHook } from '@testing-library/react'

import { Order } from 'entities/reduxStore/orderSlice'
import { fullApplicationData } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import * as useAppSelectorModule from 'shared/hooks/store/useAppSelector'
import { disableConsole } from 'tests/utils'

import { useInitialValues } from '../useInitialValues'
import { EXPECTED_DATA } from './useInitialValues.mock'

disableConsole('error')

const mockedUseAppSelector = jest.spyOn(useAppSelectorModule, 'useAppSelector')
const mockedUseMemo = jest.spyOn(React, 'useMemo')
const mockApplication = fullApplicationData
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}))

describe('useInitialValues', () => {
  beforeEach(() => {
    mockedUseMemo.mockImplementation(fn => fn())
  })

  describe('Преобразование данных работает корректно', () => {
    it('Заменяет начальное значение на данные из запроса', () => {
      mockedUseAppSelector.mockImplementation(() => {
        const orderData: Order = { orderData: mockApplication }

        return orderData
      })
      const result = renderHook(() => useInitialValues())
      expect(result.result.current.initialValues).toEqual(EXPECTED_DATA)
    })

    it('При отсутствии данных из запроса отдает начальные данные', () => {
      mockedUseAppSelector.mockImplementation(() => {
        const orderData: Order = { orderData: undefined }

        return orderData
      })
      const result = renderHook(() => useInitialValues())
      expect(result.result.current.initialValues).toEqual({ orderData: undefined })
    })
  })
})
