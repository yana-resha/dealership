import { PropsWithChildren } from 'react'

import { renderHook } from '@testing-library/react-hooks'
import { Form, Formik } from 'formik'
import { UseQueryResult } from 'react-query'
import configureMockStore from 'redux-mock-store'

import * as useGetCreditProductListQueryModule from 'common/OrderCalculator/hooks/useGetCreditProductListQuery'
import { Order } from 'entities/order/model/orderSlice'

import { MockProviders } from '../../../../tests/mocks'
import { BriefOrderCalculatorFields, UseGetCreditProductListQueryData } from '../../types'
import { useCreditProductsLimits } from '../useCreditProductsLimits'
import {
  MOCKED_CURRENT_PRODUCT,
  currentYear,
  initialData,
  MOCKED_INITIAL_PAYMENT_DATA,
  MOCKED_INITIAL_PAYMENT_DATA_WITH_CURRENT_PRODUCT,
  MOCKED_STATE_WITH_DATA,
  MOCKED_CREDIT_PRODUCT_LIST_DATA,
} from './useLimits.mock'

const mockedUseGetCreditProductListQuery = jest.spyOn(
  useGetCreditProductListQueryModule,
  'useGetCreditProductListQuery',
)
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

describe('useCreditProductLimits', () => {
  beforeEach(() => {
    mockedUseGetCreditProductListQuery.mockImplementation(
      () =>
        ({
          data: MOCKED_CREDIT_PRODUCT_LIST_DATA,
          isSuccess: true,
          isLoading: true,
        } as unknown as UseQueryResult<UseGetCreditProductListQueryData, unknown>),
    )
  })
  describe('Хук возвращает корректные данные', () => {
    it('Если durationMaxFromCarAge больше durationMin КП, то данный КП отфильтровывается из creditProducts', async () => {
      const { result } = renderHook(
        () =>
          useCreditProductsLimits({
            ...MOCKED_INITIAL_PAYMENT_DATA,
            currentProduct: MOCKED_CURRENT_PRODUCT,
            durationMaxFromAge: 24,
            isGetCarsLoading: false,
            isGetCarsSuccess: true,
            productIdsForGovernmentProgram: [],
          }),
        {
          wrapper: createWrapper({ ...initialData, carBrand: 'Skoda' }),
        },
      )
      const { creditProducts } = result.current
      expect(creditProducts.length).toEqual(1)
      expect(creditProducts[0].value).toEqual('1')
    })
    it('Если durationMaxFromClientAge больше durationMin КП, то данный КП отфильтровывается из creditProducts', async () => {
      const { result } = renderHook(
        () =>
          useCreditProductsLimits({
            ...MOCKED_INITIAL_PAYMENT_DATA,
            currentProduct: MOCKED_CURRENT_PRODUCT,
            durationMaxFromAge: 24,
            isGetCarsLoading: false,
            isGetCarsSuccess: true,
            productIdsForGovernmentProgram: [],
          }),
        {
          wrapper: createWrapper(
            {
              ...initialData,
              carYear: currentYear - 1,
            },
            {
              birthDate: `${currentYear - 72}-01-01`,
            },
          ),
        },
      )
      const { creditProducts } = result.current
      expect(creditProducts.length).toEqual(1)
      expect(creditProducts[0].value).toEqual('1')
    })
    it('Если КП не выбран, то подсказки ПВ берутся из fullDownpaymentMin и fullDownpaymentMax', async () => {
      const { result } = renderHook(
        () =>
          useCreditProductsLimits({
            ...MOCKED_INITIAL_PAYMENT_DATA,
            currentProduct: MOCKED_CURRENT_PRODUCT,
            durationMaxFromAge: 24,
            isGetCarsLoading: false,
            isGetCarsSuccess: true,
            productIdsForGovernmentProgram: [],
          }),
        {
          wrapper: createWrapper({ ...initialData, carBrand: 'Skoda' }),
        },
      )
      const { initialPaymentPercentHelperText, initialPaymentHelperText } = result.current
      expect(initialPaymentPercentHelperText).toEqual('от 0 до 90%')
      expect(initialPaymentHelperText).toEqual('от 0 до 90 ₽')
    })
    it('Если КП выбран, то подсказки ПВ берутся из его downpaymentMin и downpaymentMax', async () => {
      const { result } = renderHook(
        () =>
          useCreditProductsLimits({
            ...MOCKED_INITIAL_PAYMENT_DATA_WITH_CURRENT_PRODUCT,
            currentProduct: MOCKED_CURRENT_PRODUCT,
            durationMaxFromAge: 24,
            isGetCarsLoading: false,
            isGetCarsSuccess: true,
            productIdsForGovernmentProgram: [],
          }),
        {
          wrapper: createWrapper({
            ...initialData,
            creditProduct: '1',
          }),
        },
      )
      const { initialPaymentPercentHelperText, initialPaymentHelperText } = result.current
      expect(initialPaymentPercentHelperText).toEqual('от 20 до 80%')
      expect(initialPaymentHelperText).toEqual('от 20 до 80 ₽')
    })
  })

  describe('Эффекты', () => {
    it('Если creditProduct изначально есть в форме, но не проходит по минимальному сроку, или отсутствует productId, то очищаем поле CreditProduct', async () => {
      const { result } = renderHook(
        () =>
          useCreditProductsLimits({
            ...MOCKED_INITIAL_PAYMENT_DATA_WITH_CURRENT_PRODUCT,
            currentProduct: MOCKED_CURRENT_PRODUCT,
            durationMaxFromAge: 24,
            isGetCarsLoading: false,
            isGetCarsSuccess: true,
            productIdsForGovernmentProgram: [],
          }),
        {
          wrapper: createWrapper({
            ...initialData,
            creditProduct: '2',
            carBrand: 'Skoda',
            carYear: currentYear - 1,
          }),
        },
      )
      const { values } = result.current
      expect(values.creditProduct).toEqual(null)
    })
  })
})
