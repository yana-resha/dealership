import { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'

import { ADDITIONAL_EQUIPMENTS } from 'common/OrderCalculator/config'
import * as useGetCreditProductListQueryModule from 'common/OrderCalculator/hooks/useGetCreditProductListQuery'
import * as useGetVendorOptionsQueryModule from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import {
  prepareBankOptions,
  prepareCreditProduct,
} from 'common/OrderCalculator/utils/prepareCreditProductListData'
import { creditProductListRsData, mockGetVendorOptionsResponse } from 'shared/api/requests/dictionaryDc.mock'
import { MockProviders } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { OrderCalculator } from '../OrderCalculator'
import { formFields } from './OrderCalculator.mock'

const createWrapper = ({ children }: PropsWithChildren) => <MockProviders>{children}</MockProviders>

disableConsole('error')

const mockedUseGetVendorOptions = jest.spyOn(useGetVendorOptionsQueryModule, 'useGetVendorOptionsQuery')
const mockedUseGetCreditProductListQuery = jest.spyOn(
  useGetCreditProductListQueryModule,
  'useGetCreditProductListQuery',
)

const getCreditProductListData = {
  ...creditProductListRsData,
  ...prepareCreditProduct(creditProductListRsData.products),
  ...prepareBankOptions(creditProductListRsData.bankOptions),
}

describe('OrderCalculator', () => {
  const fn = jest.fn()

  beforeEach(() => {
    mockedUseGetCreditProductListQuery.mockImplementation(
      () =>
        ({
          data: getCreditProductListData,
          isError: false,
          isFetching: false,
        } as any),
    )
    mockedUseGetVendorOptions.mockImplementation(
      () =>
        ({
          data: mockGetVendorOptionsResponse,
          isError: false,
        } as any),
    )
  })

  describe('Форма отображается корректно', () => {
    beforeEach(() => {
      render(<OrderCalculator isSubmitLoading={false} onSubmit={fn} onChangeForm={fn} />, {
        wrapper: createWrapper,
      })
    })

    it('Основные поля присутствуют на форме', () => {
      for (const fieldName of formFields) {
        switch (fieldName) {
          case 'Стоимость':
            expect(screen.getAllByText(`${fieldName}`)).toHaveLength(4)
            break
          case 'Тип продукта':
            expect(screen.getAllByText(`${fieldName}`)).toHaveLength(2)
            break
          default:
            expect(screen.getByText(`${fieldName}`)).toBeInTheDocument()
            break
        }
      }
    })
  })

  describe('Валидация основных полей формы работает корректно', () => {
    beforeEach(() => {
      render(<OrderCalculator isSubmitLoading={false} onSubmit={fn} onChangeForm={fn} />, {
        wrapper: createWrapper,
      })
      userEvent.click(screen.getByText('Рассчитать'))
    })

    it('Валидируется верное количество обязательных полей', async () => {
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(5)
    })

    it('Ограничения минимума ПВ работает', async () => {
      const orderCalculatorForm = document.querySelector('[data-testid="orderCalculatorForm"]')!
      const carCostInput = orderCalculatorForm.querySelector('#carCost')!
      userEvent.type(carCostInput, '1000')
      const initialPaymentInput = orderCalculatorForm.querySelector('#initialPayment')!
      userEvent.type(initialPaymentInput, '10')
      expect(await screen.findByText('Значение должно быть больше 200')).toBeInTheDocument()
    })

    it('Ограничения максимума ПВ работает', async () => {
      const orderCalculatorForm = document.querySelector('[data-testid="orderCalculatorForm"]')!
      const carCostInput = orderCalculatorForm.querySelector('#carCost')!
      userEvent.type(carCostInput, '1000')
      const initialPaymentInput = orderCalculatorForm.querySelector('#initialPayment')!
      userEvent.type(initialPaymentInput, '1000')
      expect(await screen.findByText('Значение должно быть меньше 600')).toBeInTheDocument()
    })

    it('Ограничения минимума ПВ % работает', async () => {
      const initialPaymentPercentInput = document.querySelector('#initialPaymentPercent')!
      userEvent.type(initialPaymentPercentInput, '10')
      expect(await screen.findByText('Значение должно быть больше 20')).toBeInTheDocument()
    })

    it('Ограничения максимума ПВ % работает', async () => {
      const initialPaymentPercentInput = document.querySelector('#initialPaymentPercent')!
      userEvent.type(initialPaymentPercentInput, '70')
      expect(await screen.findByText('Значение должно быть меньше 60')).toBeInTheDocument()
    })

    it('Смена КП приводит к смене ограничения минимума ПВ', async () => {
      const orderCalculatorForm = document.querySelector('[data-testid="orderCalculatorForm"]')!
      const carCostInput = orderCalculatorForm.querySelector('#carCost')!
      userEvent.type(carCostInput, '1000')
      const initialPaymentInput = orderCalculatorForm.querySelector('#initialPayment')!
      userEvent.type(initialPaymentInput, '10')
      expect(await screen.findByText('Значение должно быть больше 200')).toBeInTheDocument()

      userEvent.click(screen.getByTestId('creditProduct').firstElementChild as Element)
      userEvent.click(await screen.findByText('Лайт A'))
      expect(await screen.findByText('Значение должно быть больше 300')).toBeInTheDocument()
    })

    it('Смена КП приводит к смене ограничения максимума ПВ', async () => {
      const orderCalculatorForm = document.querySelector('[data-testid="orderCalculatorForm"]')!
      const carCostInput = orderCalculatorForm.querySelector('#carCost')!
      userEvent.type(carCostInput, '1000')
      const initialPaymentInput = orderCalculatorForm.querySelector('#initialPayment')!
      userEvent.type(initialPaymentInput, '1000')
      expect(await screen.findByText('Значение должно быть меньше 600')).toBeInTheDocument()

      userEvent.click(screen.getByTestId('creditProduct').firstElementChild as Element)
      userEvent.click(await screen.findByText('Лайт A'))
      expect(await screen.findByText('Значение должно быть меньше 700')).toBeInTheDocument()
    })

    it('Смена КП приводит к смене ограничения минимума ПВ %', async () => {
      const initialPaymentPercentInput = document.querySelector('#initialPaymentPercent')!
      userEvent.type(initialPaymentPercentInput, '10')
      expect(await screen.findByText('Значение должно быть больше 20')).toBeInTheDocument()

      userEvent.click(screen.getByTestId('creditProduct').firstElementChild as Element)
      userEvent.click(await screen.findByText('Лайт A'))
      expect(await screen.findByText('Значение должно быть больше 30')).toBeInTheDocument()
    })

    it('Смена КП приводит к смене ограничения максимума ПВ %', async () => {
      const initialPaymentPercentInput = document.querySelector('#initialPaymentPercent')!
      userEvent.type(initialPaymentPercentInput, '100')
      expect(await screen.findByText('Значение должно быть меньше 60')).toBeInTheDocument()

      userEvent.click(screen.getByTestId('creditProduct').firstElementChild as Element)
      userEvent.click(await screen.findByText('Лайт A'))
      expect(await screen.findByText('Значение должно быть меньше 70')).toBeInTheDocument()
    })
  })

  describe('Валидация стоимости допов', () => {
    beforeEach(() => {
      render(<OrderCalculator isSubmitLoading={false} onSubmit={fn} onChangeForm={fn} />, {
        wrapper: createWrapper,
      })
      userEvent.click(screen.getByText('Рассчитать'))
    })

    it('Общая стоимость дополнительных услуг и оборудования не должна превышать 45% от стоимости авто', async () => {
      const orderCalculatorForm = document.querySelector('[data-testid="orderCalculatorForm"]')!
      const carCostInput = orderCalculatorForm.querySelector('#carCost')!
      userEvent.type(carCostInput, '100')

      userEvent.click(screen.getByTestId('additionalEquipments.0.productType').firstElementChild as Element)
      await act(async () => userEvent.click(await screen.findByText(ADDITIONAL_EQUIPMENTS[0].optionName)))
      const additionalEquipmentsCostField = orderCalculatorForm.querySelector(
        '[id="additionalEquipments.0.productCost"]',
      )!
      await act(() => userEvent.type(additionalEquipmentsCostField, '20'))

      userEvent.click(
        screen.getByTestId('dealerAdditionalServices.0.productType').firstElementChild as Element,
      )
      await act(async () =>
        userEvent.click(await screen.findByText(mockGetVendorOptionsResponse.options[0].optionName)),
      )
      const dealerAdditionalServiceCostField = orderCalculatorForm.querySelector(
        '[id="dealerAdditionalServices.0.productCost"]',
      )!
      await act(() => userEvent.type(dealerAdditionalServiceCostField, '30'))

      expect(
        await screen.findByText(
          'Общая стоимость дополнительных услуг и оборудования не должна превышать 45% от стоимости авто',
        ),
      ).toBeInTheDocument()
    })

    it('Общая стоимость дополнительного оборудования не должна превышать 30% от стоимости авто', async () => {
      const orderCalculatorForm = document.querySelector('[data-testid="orderCalculatorForm"]')!
      const carCostInput = orderCalculatorForm.querySelector('#carCost')!
      userEvent.type(carCostInput, '100')

      userEvent.click(screen.getByTestId('additionalEquipments.0.productType').firstElementChild as Element)
      await act(async () => userEvent.click(await screen.findByText(ADDITIONAL_EQUIPMENTS[0].optionName)))
      const additionalEquipmentsCostField = orderCalculatorForm.querySelector(
        '[id="additionalEquipments.0.productCost"]',
      )!
      await act(() => userEvent.type(additionalEquipmentsCostField, '100'))
      expect(
        await screen.findByText(
          'Общая стоимость дополнительного оборудования не должна превышать 30% от стоимости авто',
        ),
      ).toBeInTheDocument()
    })

    it('Общая стоимость дополнительных услуг дилера не должна превышать 45% от стоимости авто', async () => {
      const orderCalculatorForm = document.querySelector('[data-testid="orderCalculatorForm"]')!
      const carCostInput = orderCalculatorForm.querySelector('#carCost')!
      userEvent.type(carCostInput, '100')

      userEvent.click(
        screen.getByTestId('dealerAdditionalServices.0.productType').firstElementChild as Element,
      )
      await act(async () =>
        userEvent.click(await screen.findByText(mockGetVendorOptionsResponse.options[0].optionName)),
      )
      const dealerAdditionalServiceCostField = orderCalculatorForm.querySelector(
        '[id="dealerAdditionalServices.0.productCost"]',
      )!
      await act(() => userEvent.type(dealerAdditionalServiceCostField, '46'))

      expect(
        await screen.findByText(
          'Общая стоимость дополнительных услуг дилера не должна превышать 45% от стоимости авто',
        ),
      ).toBeInTheDocument()
    })
  })

  describe('Дополнительные поля', () => {
    beforeEach(() => {
      render(<OrderCalculator isSubmitLoading={false} onSubmit={fn} onChangeForm={fn} />, {
        wrapper: createWrapper,
      })
    })

    it('Item добавляется и удаляется, но не последний', () => {
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(3)
      const addingSquareBtn = screen.getAllByTestId('addingSquareBtn')[0]
      userEvent.click(addingSquareBtn)
      userEvent.click(addingSquareBtn)
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(5)

      userEvent.click(screen.getAllByTestId('closeSquareBtn')[0])
      userEvent.click(screen.getAllByTestId('closeSquareBtn')[0])
      userEvent.click(screen.getAllByTestId('closeSquareBtn')[0])
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(3)
    })
  })
})
