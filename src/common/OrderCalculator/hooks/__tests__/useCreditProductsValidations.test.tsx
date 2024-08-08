import { PropsWithChildren } from 'react'

import { renderHook } from '@testing-library/react-hooks'
import { Form, Formik } from 'formik'
import configureMockStore from 'redux-mock-store'

import { Order } from 'entities/reduxStore/orderSlice'
import { MockProviders } from 'tests/mocks'

import { BriefOrderCalculatorFields } from '../../types'
import {
  checkIfExceededServicesLimit,
  getServicesTotalCost,
  useCreditProductsValidations,
} from '../useCreditProductsValidations'
import { mockedUseGetCarsListQueryData } from './useGetCarsListQuery.mock'
import {
  BANK_ADDITIONAL_SERVICES,
  DEALER_ADDITIONAL_SERVICES,
  EXPECTED_ADDITIONAL_EQUIPMENTS,
  initialData,
  MOCKED_INITIAL_PAYMENT_DATA,
  MOCKED_INITIAL_PAYMENT_DATA_WITH_CURRENT_PRODUCT,
  MOCKED_STATE_WITH_DATA,
} from './useLimits.mock'

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

describe('useCreditProductValidations', () => {
  describe('Хук возвращает корректные данные', () => {
    // TODO DCB-2027 Удалить логику по обязательности КАСКО
    // it('Возвращается корректный isNecessaryCasco выбранного продукта', async () => {
    //   const { result } = renderHook(
    //     () => useCreditProductsValidations(MOCKED_INITIAL_PAYMENT_DATA_WITH_CURRENT_PRODUCT),
    //     {
    //       wrapper: createWrapper({
    //         ...initialData,
    //         creditProduct: 2,
    //       }),
    //     },
    //   )
    //   const { isNecessaryCasco } = result.current
    //   expect(isNecessaryCasco).toEqual(true)
    // })
    it('Если суммы доп. оборудования или дилерских услуг, или банковских услуг превышают от определенный процент от стоимости автомобиля, то возвращаются ошибки в commonErrors', async () => {
      const { result } = renderHook(
        () => useCreditProductsValidations(MOCKED_INITIAL_PAYMENT_DATA_WITH_CURRENT_PRODUCT),
        {
          wrapper: createWrapper({
            ...initialData,
            additionalEquipments: [
              ...EXPECTED_ADDITIONAL_EQUIPMENTS,
              { productType: '1', productCost: '1', isCredit: false, cascoLimit: '' },
            ],
            dealerAdditionalServices: [
              ...DEALER_ADDITIONAL_SERVICES,
              { productType: '1', productCost: '1', isCredit: false, cascoLimit: '' },
            ],
            bankAdditionalServices: [
              ...BANK_ADDITIONAL_SERVICES,
              { productType: '1', productCost: '1', tariff: '1', loanTerm: null },
            ],
          }),
        },
      )
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
      const { result } = renderHook(
        () => useCreditProductsValidations(MOCKED_INITIAL_PAYMENT_DATA_WITH_CURRENT_PRODUCT),
        {
          wrapper: createWrapper({
            ...initialData,
            additionalEquipments: EXPECTED_ADDITIONAL_EQUIPMENTS,
            dealerAdditionalServices: DEALER_ADDITIONAL_SERVICES,
            bankAdditionalServices: BANK_ADDITIONAL_SERVICES,
          }),
        },
      )
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
      const { result } = renderHook(
        () => useCreditProductsValidations(MOCKED_INITIAL_PAYMENT_DATA_WITH_CURRENT_PRODUCT),
        {
          wrapper: createWrapper({
            ...initialData,
            additionalEquipments: [EXPECTED_ADDITIONAL_EQUIPMENTS[0]],
            dealerAdditionalServices: [DEALER_ADDITIONAL_SERVICES[0]],
            bankAdditionalServices: [
              BANK_ADDITIONAL_SERVICES[1],
              {
                productType: '1',
                productCost: '1',
                tariff: '1',
                loanTerm: null,
              },
            ],
          }),
        },
      )
      const { commonErrors } = result.current
      expect(
        commonErrors.includes(
          'Общая стоимость дополнительных услуг и оборудования не должна превышать 45% от стоимости авто',
        ),
      ).toEqual(true)
    })
    it('Если сумма сумм доп. оборудования, дилерских услуг, банковских услуг не превышает 45% от стоимости автомобиля, то соответствующей ошибки в commonErrors нет', async () => {
      const { result } = renderHook(
        () => useCreditProductsValidations(MOCKED_INITIAL_PAYMENT_DATA_WITH_CURRENT_PRODUCT),
        {
          wrapper: createWrapper({
            ...initialData,
            additionalEquipments: [EXPECTED_ADDITIONAL_EQUIPMENTS[0]],
            dealerAdditionalServices: [DEALER_ADDITIONAL_SERVICES[0]],
            bankAdditionalServices: [BANK_ADDITIONAL_SERVICES[1]],
          }),
        },
      )
      const { commonErrors } = result.current
      expect(
        commonErrors.includes(
          'Общая стоимость дополнительных услуг и оборудования не должна превышать 45% от стоимости авто',
        ),
      ).toEqual(false)
    })
  })

  describe('Эффекты', () => {
    it('Если кредитный продукт не выбран, то параметры валидации соответствуют дефолтным значения из ручки GetCreditProductList', async () => {
      const { result } = renderHook(() => useCreditProductsValidations(MOCKED_INITIAL_PAYMENT_DATA), {
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
  })
  it('Если КП выбран, то параметры валидации соответствуют данным из КП', async () => {
    const { result } = renderHook(
      () => useCreditProductsValidations(MOCKED_INITIAL_PAYMENT_DATA_WITH_CURRENT_PRODUCT),
      {
        wrapper: createWrapper({ ...initialData, creditProduct: '2' }),
      },
    )
    const { values } = result.current
    expect(values.validationParams).toEqual({
      isNecessaryCasco: false,
      maxInitialPayment: 80,
      maxInitialPaymentPercent: 80,
      minInitialPayment: 20,
      minInitialPaymentPercent: 20,
    })
  })
  // TODO DCB-2027 Удалить логику по обязательности КАСКО
  // it('Если в выбранном КП КАСКО обязателено, а оно не выбрано, то есть ошибка isHasNotCascoOption',
  // async () => {
  //   const { result } = renderHook(
  //     () => useCreditProductsValidations(MOCKED_INITIAL_PAYMENT_DATA_WITH_CURRENT_PRODUCT),
  //     {
  //       wrapper: createWrapper({ ...initialData, creditProduct: 2 }),
  //     },
  //   )
  //   const { values } = result.current
  //   expect(values.commonError.isHasNotCascoOption).toEqual(true)
  // })
  it('Если в выбранном КП КАСКО обязателено, и оно выбрано, то нет ошибки isHasNotCascoOption', async () => {
    const { result } = renderHook(
      () => useCreditProductsValidations(MOCKED_INITIAL_PAYMENT_DATA_WITH_CURRENT_PRODUCT),
      {
        wrapper: createWrapper({
          ...initialData,
          creditProduct: '1',
          dealerAdditionalServices: [
            { productType: '15', productCost: '1', isCredit: false, cascoLimit: '' },
          ],
        }),
      },
    )
    const { values } = result.current
    expect(values.commonError.isHasNotCascoOption).toEqual(false)
  })
})

describe('getServicesTotalCost', () => {
  it('getServicesTotalCost считает суммы доп. услуг (оборудования)', () => {
    expect(getServicesTotalCost(EXPECTED_ADDITIONAL_EQUIPMENTS)).toEqual(30)
  })
  it('Если передан второй аргумент (= true), то getServicesTotalCost считает суммы доп. услуг (оборудования), взятых в кредит', () => {
    expect(
      getServicesTotalCost(
        [
          ...DEALER_ADDITIONAL_SERVICES,
          {
            productType: '1',
            productCost: '30',
            isCredit: false,
            cascoLimit: '',
          },
        ],
        true,
      ),
    ).toEqual(45)
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
