import { PropsWithChildren } from 'react'

import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { sleep } from 'shared/lib/sleep'
import { MockProviders } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import * as FindApplicationsHook from '../hooks/useFindApplications'
import { OrderSearching } from '../OrderSearching'
import * as OrderSearchingApi from '../OrderSearching.api'
import { applicationTabledataMock } from './OrderSearching.test.mock'

const createWrapper = ({ children }: PropsWithChildren) => <MockProviders>{children}</MockProviders>

disableConsole('error')

const mockedUseFindApplications = jest.spyOn(FindApplicationsHook, 'useFindApplications')
mockedUseFindApplications.mockImplementation(jest.fn())

describe('OrderSearching', () => {
  const nextStep = jest.fn()
  const onApplicationOpen = jest.fn()

  it('Изначально отображается только форма поска заявки', () => {
    mockedUseFindApplications.mockImplementation(() => ({
      isSuccessFindApplicationsQuery: false,
      isErrorFindApplicationsQuery: false,
      IsClientRequest: undefined,
    }))
    render(<OrderSearching nextStep={nextStep} onApplicationOpen={onApplicationOpen} />, {
      wrapper: createWrapper,
    })
    expect(screen.getByTestId('orderForm')).toBeInTheDocument()
    expect(screen.queryByTestId('newOrderForm')).not.toBeInTheDocument()
    expect(screen.queryByTestId('noMatchesModal')).not.toBeInTheDocument()
    expect(screen.queryByTestId('applicationTable')).not.toBeInTheDocument()
  })

  it('После ошибки поиска заяки отображается дополнительно форма новой заявки ', () => {
    mockedUseFindApplications.mockImplementation(() => ({
      isSuccessFindApplicationsQuery: false,
      isErrorFindApplicationsQuery: true,
      IsClientRequest: undefined,
    }))
    render(<OrderSearching nextStep={nextStep} onApplicationOpen={onApplicationOpen} />, {
      wrapper: createWrapper,
    })

    expect(screen.getByTestId('orderForm')).toBeInTheDocument()
    expect(screen.getByTestId('newOrderForm')).toBeInTheDocument()
    expect(screen.queryByTestId('noMatchesModal')).not.toBeInTheDocument()
    expect(screen.queryByTestId('applicationTable')).not.toBeInTheDocument()
  })

  it('После ответа поиска заяки отображается таблица заявок', () => {
    mockedUseFindApplications.mockImplementation(() => ({
      isSuccessFindApplicationsQuery: true,
      isErrorFindApplicationsQuery: false,
      IsClientRequest: applicationTabledataMock,
    }))
    render(<OrderSearching nextStep={nextStep} onApplicationOpen={onApplicationOpen} />, {
      wrapper: createWrapper,
    })

    expect(screen.getByTestId('orderForm')).toBeInTheDocument()
    expect(screen.queryByTestId('newOrderForm')).not.toBeInTheDocument()
    expect(screen.queryByTestId('noMatchesModal')).not.toBeInTheDocument()
    expect(screen.getByTestId('applicationTable')).toBeInTheDocument()
  })

  it('После ошибки создания заяки отображается модалка', async () => {
    mockedUseFindApplications.mockImplementation(() => ({
      isSuccessFindApplicationsQuery: false,
      isErrorFindApplicationsQuery: true,
      IsClientRequest: undefined,
    }))
    const mockedUseCheckIfSberClientMutation = jest.spyOn(OrderSearchingApi, 'useCheckIfSberClientMutation')
    mockedUseCheckIfSberClientMutation.mockImplementation((() => ({
      mutateAsync: () =>
        Promise.resolve({
          error: { isSberClient: false },
        }),
    })) as any)

    render(<OrderSearching nextStep={nextStep} onApplicationOpen={onApplicationOpen} />, {
      wrapper: createWrapper,
    })

    expect(screen.getByTestId('orderForm')).toBeInTheDocument()
    expect(screen.getByTestId('newOrderForm')).toBeInTheDocument()

    const newOrderForm = document.querySelector('[data-testid="newOrderForm"]')!
    const passportInput = newOrderForm.querySelector('#passport')!
    userEvent.type(passportInput, '1234123123')
    const clientNameInput = newOrderForm.querySelector('#clientName')!
    userEvent.type(clientNameInput, 'ЦЦ ЦЦ ЦЦ')
    const birthDateInput = newOrderForm.querySelector('#birthDate')!
    userEvent.type(birthDateInput, '01011990')
    const phoneNumberInput = newOrderForm.querySelector('#phoneNumber')!
    userEvent.type(phoneNumberInput, '001231234')

    const createOrderBtn = screen.getByText('Создать заявку')
    userEvent.click(createOrderBtn)

    await act(async () => await sleep(0))

    expect(screen.queryByTestId('noMatchesModal')).toBeInTheDocument()
    expect(screen.queryByTestId('applicationTable')).not.toBeInTheDocument()
  })
})
