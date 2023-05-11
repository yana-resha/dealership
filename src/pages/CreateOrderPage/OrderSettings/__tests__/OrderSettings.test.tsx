import { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as dictionaryDc from 'shared/api/dictionaryDc/dictionaryDc.api'
import { carBrands } from 'shared/api/dictionaryDc/dictionaryDc.mock'
import * as getCreditProductListApi from 'shared/api/getCreditProductList.api'
import { prepearCars } from 'shared/lib/prepearCars'
import { MockProviders } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { OrderSettings } from '../OrderSettings'
import * as OrderSettingsApi from '../OrderSettings.api'
import { dataMock } from './OrderSettings.test.mock'

const createWrapper = ({ children }: PropsWithChildren) => <MockProviders>{children}</MockProviders>

disableConsole('error')
const mockedUseCalculateCreditMutation = jest.spyOn(OrderSettingsApi, 'useCalculateCreditMutation')
const mockedUseGetCarListQuery = jest.spyOn(dictionaryDc, 'useGetCarListQuery')
const mockedUseGetCreditProductListQuery = jest.spyOn(getCreditProductListApi, 'useGetCreditProductListQuery')

describe('OrderSettings', () => {
  const nextStep = jest.fn()
  beforeEach(() => {
    mockedUseCalculateCreditMutation.mockImplementation((() => ({
      mutateAsync: () => Promise.resolve(dataMock),
    })) as any)
    mockedUseGetCarListQuery.mockImplementation((() => ({
      data: prepearCars(carBrands),
    })) as any)

    mockedUseGetCreditProductListQuery.mockImplementation(((params: any, options: any) => ({
      data: getCreditProductListApi.creditProductListRsDataMock,
      isError: false,
      isFetching: false,
    })) as any)

    render(<OrderSettings nextStep={nextStep} />, {
      wrapper: createWrapper,
    })
  })

  it('Изначально отображается только форма', () => {
    expect(screen.getByTestId('orderСalculatorForm')).toBeInTheDocument()
    expect(screen.queryByTestId('bankOffers')).not.toBeInTheDocument()
  })

  it('После ответа поиска предложений отображается таблица предложений', async () => {
    window.HTMLElement.prototype.scrollIntoView = () => null

    const orderСalculatorForm = document.querySelector('[data-testid="orderСalculatorForm"]')!
    const carBrandInput = orderСalculatorForm.querySelector('#carBrand')!
    userEvent.type(carBrandInput, 'BMW{enter}')

    const carModelInput = orderСalculatorForm.querySelector('#carModel')!
    userEvent.type(carModelInput, '1 series{enter}')
    const carCostInput = orderСalculatorForm.querySelector('#carCost')!
    userEvent.type(carCostInput, '1000000')
    const getproductListBtn = screen.getByText('Рассчитать')
    userEvent.click(getproductListBtn)

    const initialPaymentInput = orderСalculatorForm.querySelector('#initialPayment')!
    userEvent.type(initialPaymentInput, '1000')

    const submitBtn = screen.getByText('Показать')
    userEvent.click(submitBtn)

    expect(await screen.queryAllByText('Поле обязательно для заполнения')).toHaveLength(0)
    expect(await screen.findByTestId('bankOffersTable')).toBeInTheDocument()
  })
})
