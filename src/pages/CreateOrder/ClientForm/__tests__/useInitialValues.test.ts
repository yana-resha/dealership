import React from 'react'

import { AddressType, OccupationType } from '@sberauto/loanapplifecycledc-proto/public'
import { renderHook } from '@testing-library/react'

import * as getPointOfSaleFromCookiesModule from 'entities/pointOfSale/utils/getPointOfSaleFromCookies'
import * as authdcModule from 'shared/api/requests/authdc'
import { mockedUser } from 'shared/api/requests/authdc.mock'
import { fullApplicationData } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import * as useAppSelectorModule from 'shared/hooks/store/useAppSelector'
import { disableConsole } from 'tests/utils'

import { useInitialValues } from '../hooks/useInitialValues'
import { EXPECTED_DATA, EXPECTED_EMPTY_DATA } from './useInitialValues.mock'

disableConsole('error')

const mockedUseAppSelector = jest.spyOn(useAppSelectorModule, 'useAppSelector')
const mockedGetPointOfSaleFromCookies = jest.spyOn(
  getPointOfSaleFromCookiesModule,
  'getPointOfSaleFromCookies',
)
const mockedUseMemo = jest.spyOn(React, 'useMemo')
const mockApplication = fullApplicationData
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}))

describe('useClientFormInitialValues', () => {
  beforeEach(() => {
    mockedUseMemo.mockImplementation(fn => fn())
    mockedGetPointOfSaleFromCookies.mockImplementation(() => ({ unit: 'unit' }))
  })

  describe('Преобразование данных работает корректно', () => {
    it('Заменяет начальное значение на данные из запроса', () => {
      mockedUseAppSelector.mockImplementation(() => ({ initialOrder: { orderData: mockApplication } }))
      const result = renderHook(() => useInitialValues())
      expect(result.result.current.initialValues).toEqual(EXPECTED_DATA)
    })

    it('При отсутствии данных из запроса отдает начальные данные', () => {
      mockedUseAppSelector.mockImplementation(() => ({ initialOrder: { orderData: undefined } }))
      const result = renderHook(() => useInitialValues())
      expect(result.result.current.initialValues).toEqual(EXPECTED_EMPTY_DATA)
    })
  })

  describe('Преобразование данных при сохранении работает корректно', () => {
    it('Преобразовывает данные из формы для запроса', () => {
      mockedUseAppSelector.mockImplementation(() => ({
        initialOrder: { orderData: mockApplication },
        user: mockedUser,
      }))
      const result = renderHook(() => useInitialValues())
      expect(result.result.current.remapApplicationValues(EXPECTED_DATA)).toEqual(mockApplication.application)
    })

    it('Если тип занятости Безработный, то объект адреса работы не отправляется', () => {
      mockedUseAppSelector.mockImplementation(() => ({
        initialOrder: { orderData: mockApplication },
        user: mockedUser,
      }))
      const result = renderHook(() => useInitialValues())
      expect(
        result.result.current.remapApplicationValues({
          ...EXPECTED_DATA,
          occupation: OccupationType.UNEMPLOYED,
        }),
      ).toEqual({
        ...mockApplication.application,
        applicant: {
          ...mockApplication.application?.applicant,
          employment: {
            ...mockApplication.application?.applicant?.employment,
            occupation: OccupationType.UNEMPLOYED,
          },
          addresses: mockApplication.application?.applicant?.addresses?.filter(
            addres => addres.type !== AddressType.WORKPLACE,
          ),
        },
      })
    })
  })
})
