import { PropsWithChildren } from 'react'

import { renderHook } from '@testing-library/react-hooks'
import { Form, Formik } from 'formik'
import { UseQueryResult } from 'react-query'
import configureMockStore from 'redux-mock-store'

import { Order } from 'entities/reduxStore/orderSlice'

import { MockProviders } from '../../../../tests/mocks'
import { BriefOrderCalculatorFields } from '../../types'
import { useCreditProductsData } from '../useCreditProductsData'
import * as useGetCreditProductListQueryModule from '../useGetCreditProductListQuery'
import { mockedUseGetCarsListQueryData } from './useGetCarsListQuery.mock'
import { mockedUseGetCreditProductListQueryResponseData } from './useGetCreditProductListQuery.mock'
import { initialData, MOCKED_STATE_WITH_DATA } from './useLimits.mock'

const mockedUseGetCreditProductListQuery = jest.spyOn(
  useGetCreditProductListQueryModule,
  'useGetCreditProductListQuery',
)
jest.mock('common/OrderCalculator/hooks/useCarSection', () => ({
  useCarSection: () => ({
    cars: mockedUseGetCarsListQueryData.usedCars,
    isLoading: false,
    isSuccess: true,
  }),
}))

const mockStoreCreator = configureMockStore()
const createWrapper =
  (initialValues: Partial<BriefOrderCalculatorFields>, additionalState?: Partial<Order>) =>
  ({ children }: PropsWithChildren) =>
    (
      <MockProviders
        mockStore={mockStoreCreator({ order: { order: { ...MOCKED_STATE_WITH_DATA, ...additionalState } } })}
      >
        <Formik initialValues={initialValues} onSubmit={() => {}}>
          <Form>{children}</Form>
        </Formik>
      </MockProviders>
    )

describe('useCreditProductData', () => {
  beforeEach(() => {
    mockedUseGetCreditProductListQuery.mockImplementation(
      () =>
        ({
          data: mockedUseGetCreditProductListQueryResponseData,
          isSuccess: true,
          isLoading: false,
        } as unknown as UseQueryResult<
          useGetCreditProductListQueryModule.useGetCreditProductListQueryData,
          unknown
        >),
    )
  })

  describe('Хук возвращает корректные данные', () => {
    it('Если КП загружаются, то isLoadedCreditProducts false', async () => {
      mockedUseGetCreditProductListQuery.mockImplementation(
        () =>
          ({
            data: mockedUseGetCreditProductListQueryResponseData,
            isSuccess: true,
            isLoading: true,
          } as unknown as UseQueryResult<
            useGetCreditProductListQueryModule.useGetCreditProductListQueryData,
            unknown
          >),
      )
      const { result } = renderHook(() => useCreditProductsData(1), {
        wrapper: createWrapper(initialData),
      })
      const { isLoadedCreditProducts } = result.current
      expect(isLoadedCreditProducts).toEqual(false)
    })
    it('Если КП не загрузились, то isLoadedCreditProducts false', async () => {
      mockedUseGetCreditProductListQuery.mockImplementation(
        () =>
          ({
            data: mockedUseGetCreditProductListQueryResponseData,
            isSuccess: false,
            isLoading: false,
          } as unknown as UseQueryResult<
            useGetCreditProductListQueryModule.useGetCreditProductListQueryData,
            unknown
          >),
      )
      const { result } = renderHook(() => useCreditProductsData(1), {
        wrapper: createWrapper(initialData),
      })
      const { isLoadedCreditProducts } = result.current
      expect(isLoadedCreditProducts).toEqual(false)
    })
  })
})
