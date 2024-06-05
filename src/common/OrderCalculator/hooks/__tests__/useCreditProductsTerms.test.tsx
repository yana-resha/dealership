import { PropsWithChildren } from 'react'

import { renderHook } from '@testing-library/react-hooks'
import { Form, Formik } from 'formik'
import configureMockStore from 'redux-mock-store'

import { Order } from '../../../../entities/reduxStore/orderSlice'
import { MockProviders } from '../../../../tests/mocks'
import { BriefOrderCalculatorFields } from '../../types'
import { useCreditProductsTerms } from '../useCreditProductsTerms'
import {
  EXPECTED_LOAN_TERMS,
  initialData,
  MOCKED_CREDIT_DURATION_DATA,
  MOCKED_CREDIT_PRODUCTS_DATA,
  MOCKED_STATE_WITH_DATA,
} from './useLimits.mock'

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
  describe('Хук возвращает корректные данные', () => {
    it('Если КП не выбран, то loanTerms ограничивается по fullDurationMin и fullDurationMax', async () => {
      const { result } = renderHook(
        () =>
          useCreditProductsTerms(
            MOCKED_CREDIT_DURATION_DATA,
            {
              ...MOCKED_CREDIT_PRODUCTS_DATA,
              currentProduct: undefined,
            },
            100,
          ),
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
          useCreditProductsTerms(
            {
              currentDurationMin: 32,
              currentDurationMax: 72,
            },
            MOCKED_CREDIT_PRODUCTS_DATA,
            100,
          ),
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
          useCreditProductsTerms(
            MOCKED_CREDIT_DURATION_DATA,
            { ...MOCKED_CREDIT_PRODUCTS_DATA, currentProduct: undefined },
            24,
          ),
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
          useCreditProductsTerms(
            { currentDurationMin: 36, currentDurationMax: 24 },
            MOCKED_CREDIT_PRODUCTS_DATA,
            100,
          ),
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
        () => useCreditProductsTerms(MOCKED_CREDIT_DURATION_DATA, MOCKED_CREDIT_PRODUCTS_DATA, 100),
        {
          wrapper: createWrapper({ ...initialData, loanTerm: 120 }),
        },
      )
      const { values } = result.current
      expect(values.loanTerm).toEqual('')
    })
  })
})
