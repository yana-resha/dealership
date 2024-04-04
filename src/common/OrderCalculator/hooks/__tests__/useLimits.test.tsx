import { PropsWithChildren } from 'react'

import { renderHook } from '@testing-library/react-hooks'
import { Form, Formik } from 'formik'
import { UseQueryResult } from 'react-query'
import configureMockStore from 'redux-mock-store'

import * as useGetCreditProductListQueryModule from 'common/OrderCalculator/hooks/useGetCreditProductListQuery'
import { BriefOrderCalculatorFields } from 'common/OrderCalculator/types'
import { Order } from 'entities/reduxStore/orderSlice'
import { MockProviders } from 'tests/mocks'

import { checkIfExceededServicesLimit, getServicesTotalCost, useLimits } from '../useLimits'
import { mockedUseGetCarsListQueryData } from './useGetCarsListQuery.mock'
import { mockedUseGetCreditProductListQueryResponseData } from './useGetCreditProductListQuery.mock'
import {
  BANK_ADDITIONAL_SERVICES,
  DEALER_ADDITIONAL_SERVICES,
  EXPECTED_ADDITIONAL_EQUIPMENTS,
  EXPECTED_LOAN_TERMS,
  MOCKED_STATE_WITH_DATA,
  currentYear,
  initialData,
} from './useLimits.mock'

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

describe('useLimits', () => {
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

  describe('Хук врзвращает корректные данные', () => {
    it('Если durationMaxFromCarAge больше durationMin КП, то данный КП отфильтровывается из creditProducts', async () => {
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({ ...initialData, carBrand: 'Skoda' }),
      })
      const { creditProducts } = result.current
      expect(creditProducts.length).toEqual(1)
      expect(creditProducts[0].value).toEqual('ACDC')
    })
    it('Если durationMaxFromClientAge больше durationMin КП, то данный КП отфильтровывается из creditProducts', async () => {
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper(
          {
            ...initialData,
            carYear: currentYear - 1,
          },
          {
            birthDate: `${currentYear - 72}-01-01`,
          },
        ),
      })
      const { creditProducts } = result.current
      expect(creditProducts.length).toEqual(1)
      expect(creditProducts[0].value).toEqual('ACDC')
    })
    it('Если КП не выбран, то подсказки ПВ берутся из fullDownpaymentMin и fullDownpaymentMax', async () => {
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({ ...initialData, carBrand: 'Skoda' }),
      })
      const { initialPaymentPercentHelperText, initialPaymentHelperText } = result.current
      expect(initialPaymentPercentHelperText).toEqual('до 90%')
      expect(initialPaymentHelperText).toEqual('до 90 ₽')
    })
    it('Если КП выбран, то подсказки ПВ берутся из его downpaymentMin и downpaymentMax', async () => {
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({
          ...initialData,
          creditProduct: 'ACDC',
        }),
      })
      const { initialPaymentPercentHelperText, initialPaymentHelperText } = result.current
      expect(initialPaymentPercentHelperText).toEqual('от 20 до 80%')
      expect(initialPaymentHelperText).toEqual('от 20 до 80 ₽')
    })
    it('Если КП не выбран, то loanTerms ограничивается по fullDurationMin и fullDurationMax', async () => {
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper(initialData),
      })
      const { loanTerms } = result.current
      expect(loanTerms).toEqual(EXPECTED_LOAN_TERMS)
    })
    it('Если КП выбран, то loanTerms ограничивается по durationMin и durationMax, выбранного КП', async () => {
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({
          ...initialData,
          creditProduct: 'AKHC',
        }),
      })
      const { loanTerms } = result.current
      expect(loanTerms).toEqual(EXPECTED_LOAN_TERMS.slice(1, 5))
    })
    it('Если durationMaxFromAge меньше durationMax или fullDurationMax (Если КП не выбран), то loanTerms ограничивается по нему', async () => {
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({ ...initialData, carBrand: 'Skoda' }),
      })
      const { loanTerms } = result.current
      expect(loanTerms).toEqual(EXPECTED_LOAN_TERMS.slice(0, 1))
    })
    it('Если полцчившийся durationMax меньше durationMin, то loanTerms пустой массив', async () => {
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({ ...initialData, carBrand: 'BMW' }),
      })
      const { loanTerms } = result.current
      expect(loanTerms).toEqual([])
    })
    it('Возвращается корректный isNecessaryCasco выбранного продукта', async () => {
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({
          ...initialData,
          creditProduct: 'AKHC',
        }),
      })
      const { isNecessaryCasco } = result.current
      expect(isNecessaryCasco).toEqual(true)
    })
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
      const { result } = renderHook(() => useLimits('1'), {
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
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper(initialData),
      })
      const { isLoadedCreditProducts } = result.current
      expect(isLoadedCreditProducts).toEqual(false)
    })
    it('Если суммы доп. оборудования или дилерских услуг, или банковских услуг превышают от определенный процент от стоимости автомобиля, то возвращаются ошибки в commonErrors', async () => {
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
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({
          ...initialData,
          additionalEquipments: [
            ...EXPECTED_ADDITIONAL_EQUIPMENTS,
            { productType: 1, productCost: '1', isCredit: false },
          ],
          dealerAdditionalServices: [
            ...DEALER_ADDITIONAL_SERVICES,
            { productType: 1, productCost: '1', isCredit: false },
          ],
          bankAdditionalServices: [
            ...BANK_ADDITIONAL_SERVICES,
            { productType: 1, productCost: '1', isCredit: false },
          ],
        }),
      })
      const { commonErrors } = result.current
      expect(
        commonErrors.includes(
          'Общая стоимость дополнительного оборудования не должна превышать 30% от стоимости авто',
        ),
      ).toEqual(true)
      expect(
        commonErrors.includes(
          'Общая стоимость дополнительных услуг дилера не должна превышать 45% от стоимости авто',
        ),
      ).toEqual(true)
      expect(
        commonErrors.includes(
          'Общая стоимость дополнительных услуг банка не должна превышать 30% от стоимости авто',
        ),
      ).toEqual(true)
    })
    it('Если суммы доп. оборудования или дилерских услуг, или банковских услуг не превышают от определенный процент от стоимости автомобиля, то соответствующих ошибок в commonErrors нет', async () => {
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
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({
          ...initialData,
          additionalEquipments: EXPECTED_ADDITIONAL_EQUIPMENTS,
          dealerAdditionalServices: DEALER_ADDITIONAL_SERVICES,
          bankAdditionalServices: BANK_ADDITIONAL_SERVICES,
        }),
      })
      const { commonErrors } = result.current
      expect(
        commonErrors.includes(
          'Общая стоимость дополнительного оборудования не должна превышать 30% от стоимости авто',
        ),
      ).toEqual(false)
      expect(
        commonErrors.includes(
          'Общая стоимость дополнительных услуг дилера не должна превышать 45% от стоимости авто',
        ),
      ).toEqual(false)
      expect(
        commonErrors.includes(
          'Общая стоимость дополнительных услуг банка не должна превышать 30% от стоимости авто',
        ),
      ).toEqual(false)
    })
    it('Если сумма сумм доп. оборудования, дилерских услуг, банковских услуг превышает 45% от стоимости автомобиля, то возвращается соответствующая ошибка в commonErrors', async () => {
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
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({
          ...initialData,
          additionalEquipments: [EXPECTED_ADDITIONAL_EQUIPMENTS[0]],
          dealerAdditionalServices: [DEALER_ADDITIONAL_SERVICES[0]],
          bankAdditionalServices: [
            BANK_ADDITIONAL_SERVICES[1],
            {
              productType: 1,
              productCost: '1',
              isCredit: true,
            },
          ],
        }),
      })
      const { commonErrors } = result.current
      expect(
        commonErrors.includes(
          'Общая стоимость дополнительных услуг и оборудования не должна превышать 45% от стоимости авто',
        ),
      ).toEqual(true)
    })
    it('Если сумма сумм доп. оборудования, дилерских услуг, банковских услуг не превышает 45% от стоимости автомобиля, то соответствующей ошибки в commonErrors нет', async () => {
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
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({
          ...initialData,
          additionalEquipments: [EXPECTED_ADDITIONAL_EQUIPMENTS[0]],
          dealerAdditionalServices: [DEALER_ADDITIONAL_SERVICES[0]],
          bankAdditionalServices: [BANK_ADDITIONAL_SERVICES[1]],
        }),
      })
      const { commonErrors } = result.current
      expect(
        commonErrors.includes(
          'Общая стоимость дополнительных услуг и оборудования не должна превышать 45% от стоимости авто',
        ),
      ).toEqual(false)
    })
  })

  describe('Эффекты', () => {
    it('Если creditProduct изначально есть в форме, но не проходит по минимальному сроку, или отсутствует productId, то очищаем поле CreditProduct', async () => {
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
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({
          ...initialData,
          creditProduct: 'ACDC',
          carBrand: 'Skoda',
          carYear: currentYear - 1,
        }),
      })
      const { values } = result.current
      expect(values.creditProduct).toEqual('')
    })

    it('Если loanTerm изначально есть в форме, но по какой-то причине не входит в диапазон допустимых сроков, то очищаем поле', async () => {
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
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({ ...initialData, loanTerm: 120 }),
      })
      const { values } = result.current
      expect(values.loanTerm).toEqual('')
    })

    it('Если кредитный продукт не выбран, то параметры валидации соответствуют дефолтным значения из ручки GetCreditProductList', async () => {
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
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper(initialData),
      })
      const { values } = result.current
      expect(values.validationParams).toEqual({
        isNecessaryCasco: false,
        maxInitialPayment: 90,
        maxInitialPaymentPercent: 90,
        minInitialPayment: 0,
        minInitialPaymentPercent: 0,
      })
    })

    it('Если КП выбран, то параметры валидации соответствуют данным из КП', async () => {
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
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({ ...initialData, creditProduct: 'ACDC' }),
      })
      const { values } = result.current
      expect(values.validationParams).toEqual({
        isNecessaryCasco: true,
        maxInitialPayment: 80,
        maxInitialPaymentPercent: 80,
        minInitialPayment: 20,
        minInitialPaymentPercent: 20,
      })
    })

    it('Если в выбранном КП КАСКО обязателено, а оно не выбрано, то есть ошибка isHasNotCascoOption', async () => {
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
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({ ...initialData, creditProduct: 'ACDC' }),
      })
      const { values } = result.current
      expect(values.commonError.isHasNotCascoOption).toEqual(true)
    })

    it('Если в выбранном КП КАСКО обязателено, и оно выбрано, то нет ошибки isHasNotCascoOption', async () => {
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
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({
          ...initialData,
          creditProduct: 'ACDC',
          dealerAdditionalServices: [{ productType: 15, productCost: '1', isCredit: false }],
        }),
      })
      const { values } = result.current
      expect(values.commonError.isHasNotCascoOption).toEqual(false)
    })

    it('Если в выбранном КП КАСКО обязателено, и оно выбрано, то нет ошибки isHasNotCascoOption', async () => {
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
      const { result } = renderHook(() => useLimits('1'), {
        wrapper: createWrapper({
          ...initialData,
          creditProduct: 'ACDC',
          dealerAdditionalServices: [{ productType: 15, productCost: '1', isCredit: false }],
        }),
      })
      const { values } = result.current
      expect(values.commonError.isHasNotCascoOption).toEqual(false)
    })
  })
})

describe('getServicesTotalCost', () => {
  it('getServicesTotalCost считает суммы доп. услуг (оборудования)', () => {
    expect(getServicesTotalCost(EXPECTED_ADDITIONAL_EQUIPMENTS)).toEqual(30)
  })
  it('Если передан второй аргумент (= true), то getServicesTotalCost считает суммы доп. услуг (оборудования), взятых в кредит', () => {
    expect(getServicesTotalCost(BANK_ADDITIONAL_SERVICES, true)).toEqual(10)
  })
})

describe('checkIfExceededServicesLimit', () => {
  it('Если carCost невалиден, то возвращается false', () => {
    expect(checkIfExceededServicesLimit(NaN, true)).toEqual(false)
  })
  it('Если carCost валиден, то возвращается criterion', () => {
    const criterion_1 = true
    const criterion_2 = true
    expect(checkIfExceededServicesLimit(1, criterion_1)).toEqual(criterion_1)
    expect(checkIfExceededServicesLimit(1, criterion_2)).toEqual(criterion_2)
  })
})
