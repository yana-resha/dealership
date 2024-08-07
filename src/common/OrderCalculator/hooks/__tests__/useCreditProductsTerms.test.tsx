import { PropsWithChildren } from 'react'

import { renderHook } from '@testing-library/react-hooks'
import { Form, Formik } from 'formik'
import { UseQueryResult } from 'react-query'
import configureMockStore from 'redux-mock-store'

import * as useGetCreditProductListQueryModule from 'common/OrderCalculator/hooks/useGetCreditProductListQuery'

import { Order } from '../../../../entities/order/model/orderSlice'
import { MockProviders } from '../../../../tests/mocks'
import { BriefOrderCalculatorFields, UseGetCreditProductListQueryData } from '../../types'
import { useCreditProductsTerms } from '../useCreditProductsTerms'
import {
  EXPECTED_LOAN_TERMS,
  initialData,
  MOCKED_CREDIT_DURATION_DATA,
  MOCKED_CREDIT_PRODUCT_LIST_DATA,
  MOCKED_CURRENT_PRODUCT,
  MOCKED_STATE_WITH_DATA,
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

describe('useCreditProductTerms', () => {
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
    it('Если КП не выбран, то loanTerms ограничивается по fullDurationMin и fullDurationMax', async () => {
      const { result } = renderHook(
        () =>
          useCreditProductsTerms({
            ...MOCKED_CREDIT_DURATION_DATA,
            currentProduct: undefined,
            durationMaxFromAge: 100,
          }),
        {
          wrapper: createWrapper(initialData),
        },
      )
      const { loanTerms } = result.current
      expect(loanTerms).toEqual(EXPECTED_LOAN_TERMS)
    })
    it('Если КП выбран, то loanTerms ограничивается по durationMin и durationMax, выбранного КП', async () => {
      const { result } = renderHook(
        () =>
          useCreditProductsTerms({
            currentDurationMin: 32,
            currentDurationMax: 72,
            currentProduct: MOCKED_CURRENT_PRODUCT,
            durationMaxFromAge: 100,
          }),

        {
          wrapper: createWrapper({
            ...initialData,
            creditProduct: '2',
          }),
        },
      )
      const { loanTerms } = result.current
      expect(loanTerms).toEqual(EXPECTED_LOAN_TERMS.slice(1, 5))
    })
    it('Если durationMaxFromAge меньше durationMax или fullDurationMax (Если КП не выбран), то loanTerms ограничивается по нему', async () => {
      const { result } = renderHook(
        () =>
          useCreditProductsTerms({
            ...MOCKED_CREDIT_DURATION_DATA,
            currentProduct: undefined,
            durationMaxFromAge: 24,
          }),
        {
          wrapper: createWrapper({ ...initialData, carBrand: 'Skoda' }),
        },
      )
      const { loanTerms } = result.current
      expect(loanTerms).toEqual(EXPECTED_LOAN_TERMS.slice(0, 1))
    })
    it('Если получившийся durationMax меньше durationMin, то loanTerms пустой массив', async () => {
      const { result } = renderHook(
        () =>
          useCreditProductsTerms({
            currentDurationMin: 36,
            currentDurationMax: 24,
            currentProduct: MOCKED_CURRENT_PRODUCT,
            durationMaxFromAge: 100,
          }),
        {
          wrapper: createWrapper({ ...initialData, carBrand: 'BMW' }),
        },
      )
      const { loanTerms } = result.current
      expect(loanTerms).toEqual([])
    })
  })

  describe('Эффекты', () => {
    it('Если loanTerm изначально есть в форме, но по какой-то причине не входит в диапазон допустимых сроков, то очищаем поле', async () => {
      const { result } = renderHook(
        () =>
          useCreditProductsTerms({
            ...MOCKED_CREDIT_DURATION_DATA,
            currentProduct: MOCKED_CURRENT_PRODUCT,
            durationMaxFromAge: 100,
          }),
        {
          wrapper: createWrapper({ ...initialData, loanTerm: 120 }),
        },
      )
      const { values } = result.current
      expect(values.loanTerm).toEqual('')
    })
  })
})
