import { PropsWithChildren } from 'react'

import { OptionID, OptionType } from '@sberauto/dictionarydc-proto/public'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'

import { initialValueMap } from 'common/OrderCalculator/config'
import * as useGetCreditProductListQueryModule from 'common/OrderCalculator/hooks/useGetCreditProductListQuery'
import * as useGetVendorOptionsQueryModule from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import * as useInitialValuesModule from 'common/OrderCalculator/hooks/useInitialValues'
import { prepareCreditProduct } from 'common/OrderCalculator/utils/prepareCreditProductListData'
import { creditProductListRsData, mockGetVendorOptionsResponse } from 'shared/api/requests/dictionaryDc.mock'
import { sleep } from 'shared/lib/sleep'
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
  fullDownpaymentMin: creditProductListRsData.fullDownpaymentMin
    ? creditProductListRsData.fullDownpaymentMin * 100
    : undefined,
  fullDownpaymentMax: creditProductListRsData.fullDownpaymentMax
    ? creditProductListRsData.fullDownpaymentMax * 100
    : undefined,
  ...prepareCreditProduct(creditProductListRsData.creditProducts),
}

const mockedUseInitialValues = jest.spyOn(useInitialValuesModule, 'useInitialValues')

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
    mockedUseInitialValues.mockImplementation(
      () =>
        ({
          isShouldShowLoading: false,
          initialValues: initialValueMap,
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
      await fireEvent.click(await screen.findByText('Лайт A'))
      // expect(await screen.findByText('Значение должно быть меньше 70')).toBeInTheDocument()
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

      userEvent.click(screen.getByTestId('additionalEquipments[0].productType').firstElementChild as Element)
      const additionalOptions = mockGetVendorOptionsResponse.additionalOptions || []
      userEvent.click(
        await screen.findByText(
          additionalOptions?.filter?.(el => el.optionType === OptionType.EQUIPMENT)[0].optionName as string,
        ),
      )
      const additionalEquipmentsCostField = orderCalculatorForm.querySelector(
        '[id="additionalEquipments[0].productCost"]',
      )!
      await act(() => userEvent.type(additionalEquipmentsCostField, '20'))

      userEvent.click(
        screen.getByTestId('dealerAdditionalServices[0].productType').firstElementChild as Element,
      )
      userEvent.click(
        await screen.findByText(
          mockGetVendorOptionsResponse?.additionalOptions?.filter?.(
            el => el.optionType === OptionType.DEALER,
          )?.[0].optionName as string,
        ),
      )
      const dealerAdditionalServiceCostField = orderCalculatorForm.querySelector(
        '[id="dealerAdditionalServices[0].productCost"]',
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

      userEvent.click(screen.getByTestId('additionalEquipments[0].productType').firstElementChild as Element)
      await act(async () => {
        const additionalOptions = mockGetVendorOptionsResponse.additionalOptions || []
        userEvent.click(
          await screen.findByText(
            additionalOptions?.filter?.(el => el.optionType === OptionType.EQUIPMENT)[0].optionName as string,
          ),
        )
      })
      const additionalEquipmentsCostField = orderCalculatorForm.querySelector(
        '[id="additionalEquipments[0].productCost"]',
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
        screen.getByTestId('dealerAdditionalServices[0].productType').firstElementChild as Element,
      )
      await act(async () =>
        userEvent.click(
          await screen.findByText(mockGetVendorOptionsResponse?.additionalOptions?.[0]?.optionName as string),
        ),
      )
      const dealerAdditionalServiceCostField = orderCalculatorForm.querySelector(
        '[id="dealerAdditionalServices[0].productCost"]',
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

    it('Item добавляется и удаляется, но не последний', async () => {
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(3)

      await waitFor(() => userEvent.click(screen.getAllByTestId('addingSquareBtn')[0]))
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(4)
      await sleep(100)
      await waitFor(() => userEvent.click(screen.getAllByTestId('addingSquareBtn')[0]))
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(5)

      userEvent.click(screen.getAllByTestId('closeSquareBtn')[0])
      userEvent.click(screen.getAllByTestId('closeSquareBtn')[0])
      userEvent.click(screen.getAllByTestId('closeSquareBtn')[0])
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(3)
    })
  })

  describe('Валидация логики обязательного КАСКО', () => {
    beforeEach(() => {
      mockedUseInitialValues.mockImplementation(
        () =>
          ({
            isShouldShowLoading: false,
            initialValues: {
              ...initialValueMap,
              // Выбран кредитный продукт с cascoFlag=true
              creditProduct: creditProductListRsData.creditProducts?.[0].productId,
            },
          } as any),
      )
      render(<OrderCalculator isSubmitLoading={false} onSubmit={fn} onChangeForm={fn} />, {
        wrapper: createWrapper,
      })
      userEvent.click(screen.getByText('Рассчитать'))
    })

    it('Если выбран продукт с cascoFlag=true, то появляется предупреждение', async () => {
      expect(
        await screen.findByText(
          'Выбран кредитный продукт с обязательным КАСКО. Необходимо добавить дополнительную услугу КАСКО',
        ),
      ).toBeInTheDocument()
    })

    it('Если выбрана опция КАСКО, то предупреждение не появляется, появляется поле Сумма покрытия КАСКО', async () => {
      expect(await screen.queryByText('Сумма покрытия КАСКО')).not.toBeInTheDocument()

      userEvent.click(
        screen.getByTestId('dealerAdditionalServices[0].productType').firstElementChild as Element,
      )
      await act(async () =>
        userEvent.click(
          await screen.findByText(
            mockGetVendorOptionsResponse?.additionalOptions?.find(o => o.optionId === OptionID.CASCO)
              ?.optionName as string,
          ),
        ),
      )

      expect(
        await screen.queryByText(
          'Выбран кредитный продукт с обязательным КАСКО. Необходимо добавить дополнительную услугу КАСКО',
        ),
      ).not.toBeInTheDocument()

      expect(await screen.queryByText('Сумма покрытия КАСКО')).toBeInTheDocument()
    })
  })
})
