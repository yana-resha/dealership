import React from 'react'

import { configInitialValues } from 'pages/CreateOrderPage/ClientForm/config/clientFormInitialValues'
import * as useGetFullApplicationQueryModule from 'shared/api/requests/loanAppLifeCycleDc'
import { fullApplicationData } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import * as useAppSelectorModule from 'shared/hooks/store/useAppSelector'
import { disableConsole } from 'tests/utils'

import { useInitialValues } from '../useInitialValues'
import { EXPECTED_DATA } from './useInitialValues.mock'

disableConsole('error')

const mockedUseGetFullApplicationQuery = jest.spyOn(
  useGetFullApplicationQueryModule,
  'useGetFullApplicationQuery',
)

const mockedUseMemo = jest.spyOn(React, 'useMemo')
const mockedUseAppSelector = jest.spyOn(useAppSelectorModule, 'useAppSelector')

describe('useInitialValues', () => {
  beforeEach(() => {
    mockedUseMemo.mockImplementation(fn => fn())
    mockedUseAppSelector.mockImplementation(() => configInitialValues)
  })
  describe('Преобразование данных работает корректно', () => {
    it('Заменяет начальное значение на данные из запроса', () => {
      mockedUseGetFullApplicationQuery.mockImplementation(
        () =>
          ({
            data: fullApplicationData,
            isLoading: true,
          } as any),
      )
      expect(useInitialValues()).toEqual({
        isShouldShowLoading: true,
        initialValues: EXPECTED_DATA,
      })
    })
    it('При отсутствии данных из запроса отдает начальные данные', () => {
      mockedUseGetFullApplicationQuery.mockImplementation(
        () =>
          ({
            data: undefined,
            isLoading: true,
          } as any),
      )
      expect(useInitialValues()).toEqual({
        isShouldShowLoading: true,
        initialValues: configInitialValues,
      })
    })
  })
})
