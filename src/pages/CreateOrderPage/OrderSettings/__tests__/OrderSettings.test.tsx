import React from 'react'
// import { PropsWithChildren } from 'react'

// import { render, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'

// import * as dictionaryDc from 'shared/api/dictionaryDc/dictionaryDc.api'
// import { carBrands } from 'shared/api/dictionaryDc/dictionaryDc.mock'
// import * as getCreditProductListApi from 'shared/api/getCreditProductList.api'
// import { prepearCars } from 'shared/lib/prepearCars'
// import { MockProviders } from 'tests/mocks'
// import { disableConsole } from 'tests/utils'

// import { OrderSettings } from '../OrderSettings'
// import * as OrderSettingsApi from '../OrderSettings.api'
// import { mockCalculateCreditResponseForTest } from './OrderSettings.test.mock'

// const createWrapper = ({ children }: PropsWithChildren) => <MockProviders>{children}</MockProviders>

// disableConsole('error')

// const mockedUseCalculateCreditMutation = jest.spyOn(OrderSettingsApi, 'useCalculateCreditMutation')

// describe('OrderSettings', () => {
//   //TODO https://jira.x.sberauto.com/browse/DCB-313
//   it.todo('Тесты выполняются непростительно долго! нужно оптимизировать')

// const nextStep = jest.fn()
// beforeEach(() => {
//   mockedUseCalculateCreditMutation.mockImplementation((() => ({
//     mutateAsync: () => Promise.resolve(dataMock),
//   })) as any)

//   render(<OrderSettings nextStep={nextStep} />, {
//     wrapper: createWrapper,
//   })
// })

// it('Изначально отображается только форма', () => {
//   expect(screen.getByTestId('orderCalculatorForm')).toBeInTheDocument()
//   expect(screen.queryByTestId('bankOffers')).not.toBeInTheDocument()
// })

// it('После ответа поиска предложений отображается таблица предложений', async () => {
//   window.HTMLElement.prototype.scrollIntoView = () => null

//   const orderCalculatorForm = document.querySelector('[data-testid="orderCalculatorForm"]')!

//   const carBrandInput = orderCalculatorForm.querySelector('#carBrand')!
//   userEvent.type(carBrandInput, 'Fiat{enter}')
//   const carModelInput = orderCalculatorForm.querySelector('#carModel')!
//   userEvent.type(carModelInput, '1 series{enter}')
//   const carCostInput = orderCalculatorForm.querySelector('#carCost')!
//   userEvent.type(carCostInput, '1000000')
//   const initialPaymentInput = orderCalculatorForm.querySelector('#initialPayment')!
//   userEvent.type(initialPaymentInput, '1000')

//   const submitBtn = screen.getByText('Показать')
//   userEvent.click(submitBtn)

//   expect(screen.getByTestId('orderCalculatorForm')).toBeInTheDocument()
//   expect(await screen.findByTestId('bankOffersTable')).toBeInTheDocument()
// })
// })

describe('OrderSettings', () => {
  //TODO https://jira.x.sberauto.com/browse/DCB-313
  it.todo('Тесты выполняются непростительно долго! нужно оптимизировать')
})
