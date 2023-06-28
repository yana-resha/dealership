import React from 'react'

import { fullInitialValueMap } from 'common/OrderCalculator/config'
import * as useGetFullApplicationQueryModule from 'shared/api/requests/loanAppLifeCycleDc'
import { fullApplicationData } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import { disableConsole } from 'tests/utils'

import { useInitialValues } from '../useInitialValues'
import { EXPECTED_FULL_DATA } from './useInitialValues.mock'

disableConsole('error')

const mockedUseGetFullApplicationQuery = jest.spyOn(
  useGetFullApplicationQueryModule,
  'useGetFullApplicationQuery',
)

const mockedUseMemo = jest.spyOn(React, 'useMemo')

describe('useInitialValues', () => {
  beforeEach(() => {
    mockedUseMemo.mockImplementation(fn => fn())
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
      expect(useInitialValues(fullInitialValueMap, '12345', true)).toEqual({
        isShouldShowLoading: true,
        hasCustomInitialValues: true,
        initialValues: EXPECTED_FULL_DATA,
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
      expect(useInitialValues(fullInitialValueMap, '12345', true)).toEqual({
        isShouldShowLoading: true,
        hasCustomInitialValues: true,
        initialValues: fullInitialValueMap,
      })
    })
  })
})
