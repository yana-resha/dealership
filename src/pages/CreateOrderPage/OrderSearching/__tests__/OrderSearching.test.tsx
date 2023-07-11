/* eslint-disable no-empty */
import { PropsWithChildren } from 'react'

import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import configureMockStore from 'redux-mock-store'

import * as ApiHooks from 'common/findApplication/findApplications/hooks/useFindApplicationsQuery'
import { MockProviders } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import * as orderSlice from '../../model/orderSlice'
import { OrderSearching } from '../OrderSearching'
import * as Hooks from '../OrderSearching.hooks'
import { applicationTabledataMock } from './OrderSearching.test.mock'

jest.mock('shared/hooks/store/useAppDispatch', () => ({ useAppDispatch: () => (param: any) => {} }))

const mockEnqueue = jest.fn()

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueue,
  }),
}))

const useCheckIfSberClientCreator = (isClient: boolean) =>
  (({ onSuccess }: { onSuccess: (...arg: any[]) => void }) => ({
    mutateAsync: (request: any) =>
      Promise.resolve({ response: { isClient }, request }).then(({ response, request }) =>
        onSuccess(!!response.isClient, request),
      ),
  })) as any

const createWrapper = ({ children }: PropsWithChildren) => <MockProviders>{children}</MockProviders>

disableConsole('error')
jest.useFakeTimers('legacy')

const mockedUseFindApplications = jest.spyOn(ApiHooks, 'useFindApplicationsQuery')
mockedUseFindApplications.mockImplementation(jest.fn())

Object.defineProperty(window, 'requestAnimationFrame', { value: (cb: () => any) => cb() })

describe('OrderSearching', () => {
  const nextStep = jest.fn()
  const onApplicationOpen = jest.fn()
  const mockRefetch = jest.fn()
  const onMount = jest.fn()
  const mockStoreCreator = configureMockStore()

  describe('Элементы формы отображаются', () => {
    it('Изначально отображается только форма поиска заявки', () => {
      mockedUseFindApplications.mockImplementation(() => ({
        isSuccess: false,
        isLoading: false,
        data: undefined,
        refetch: mockRefetch,
        remove: jest.fn(),
      }))

      render(<OrderSearching nextStep={nextStep} onApplicationOpen={onApplicationOpen} onMount={onMount} />, {
        wrapper: createWrapper,
      })

      expect(screen.getByTestId('orderForm')).toBeInTheDocument()
      expect(screen.queryByTestId('newOrderForm')).not.toBeInTheDocument()
      expect(screen.queryByTestId('noMatchesModal')).not.toBeInTheDocument()
      expect(screen.queryByTestId('applicationTable')).not.toBeInTheDocument()
    })

    it('Если поиск не дал результатов, то отображается дополнительно форма новой заявки ', async () => {
      mockedUseFindApplications.mockImplementation(() => ({
        isSuccess: true,
        isLoading: false,
        data: undefined,
        refetch: mockRefetch,
        remove: jest.fn(),
      }))

      render(<OrderSearching nextStep={nextStep} onApplicationOpen={onApplicationOpen} onMount={onMount} />, {
        wrapper: createWrapper,
      })

      expect(screen.getByTestId('orderForm')).toBeInTheDocument()
      expect(screen.queryByTestId('newOrderForm')).not.toBeInTheDocument()

      const orderForm = screen.getByTestId('orderForm')

      const passportInput = orderForm.querySelector('#passport')!
      userEvent.type(passportInput, '1234123123')
      const clientNameInput = orderForm.querySelector('#clientName')!
      userEvent.type(clientNameInput, 'ЦЦ ЦЦ ЦЦ')
      const birthDateInput = orderForm.querySelector('#birthDate')!
      userEvent.type(birthDateInput, '01011990')
      const phoneNumberInput = orderForm.querySelector('#phoneNumber')!

      await act(async () => {
        userEvent.type(phoneNumberInput, '001231234')
      })
      const findOrderBtn = screen.getByText('Найти')

      await act(async () => {
        userEvent.click(findOrderBtn)
      })
      await act(async () => {})

      expect(screen.getByTestId('newOrderForm')).toBeInTheDocument()
      expect(screen.queryByTestId('noMatchesModal')).not.toBeInTheDocument()
      expect(screen.queryByTestId('applicationTable')).not.toBeInTheDocument()
    })

    it('После ответа поиска заявки отображается таблица заявок', () => {
      mockedUseFindApplications.mockImplementation(() => ({
        isSuccess: true,
        isLoading: false,
        data: applicationTabledataMock,
        refetch: mockRefetch,
        remove: jest.fn(),
      }))

      render(<OrderSearching nextStep={nextStep} onApplicationOpen={onApplicationOpen} onMount={onMount} />, {
        wrapper: createWrapper,
      })

      expect(screen.getByTestId('orderForm')).toBeInTheDocument()
      expect(screen.queryByTestId('newOrderForm')).not.toBeInTheDocument()
      expect(screen.queryByTestId('noMatchesModal')).not.toBeInTheDocument()
      expect(screen.getByTestId('applicationTable')).toBeInTheDocument()
    })

    it('После ошибки создания заявки отображается модалка с ошибкой', async () => {
      mockedUseFindApplications.mockImplementation(() => ({
        isSuccess: true,
        isLoading: false,
        data: undefined,
        refetch: mockRefetch,
        remove: jest.fn(),
      }))

      jest.spyOn(Hooks, 'useCheckIfSberClient').mockImplementation(useCheckIfSberClientCreator(false))

      render(<OrderSearching nextStep={nextStep} onApplicationOpen={onApplicationOpen} onMount={onMount} />, {
        wrapper: createWrapper,
      })

      expect(screen.getByTestId('orderForm')).toBeInTheDocument()
      expect(screen.queryByTestId('newOrderForm')).not.toBeInTheDocument()

      const orderForm = screen.getByTestId('orderForm')

      const passportInput = orderForm.querySelector('#passport')!
      userEvent.type(passportInput, '1234123123')
      const clientNameInput = orderForm.querySelector('#clientName')!
      userEvent.type(clientNameInput, 'ЦЦ ЦЦ ЦЦ')
      const birthDateInput = orderForm.querySelector('#birthDate')!
      userEvent.type(birthDateInput, '01011990')
      const phoneNumberInput = orderForm.querySelector('#phoneNumber')!

      await act(async () => {
        userEvent.type(phoneNumberInput, '001231234')
      })
      const findOrderBtn = screen.getByText('Найти')

      await act(async () => {
        userEvent.click(findOrderBtn)
      })

      const createOrderBtn = screen.getByText('Создать заявку')

      await act(async () => {
        userEvent.click(createOrderBtn)
      })

      expect(screen.getByTestId('noMatchesModal')).toBeInTheDocument()
      expect(screen.queryByTestId('applicationTable')).not.toBeInTheDocument()
    })
  })

  it('Удаляем данные из стора при поиске заявок', async () => {
    mockedUseFindApplications.mockImplementation(() => ({
      isSuccess: true,
      isLoading: false,
      data: undefined,
      refetch: mockRefetch,
      remove: jest.fn(),
    }))

    jest.spyOn(Hooks, 'useCheckIfSberClient').mockImplementation(useCheckIfSberClientCreator(false))

    const mockClearOrder = jest.spyOn(orderSlice, 'clearOrder')

    render(<OrderSearching nextStep={nextStep} onApplicationOpen={onApplicationOpen} onMount={onMount} />, {
      wrapper: createWrapper,
    })

    expect(screen.getByTestId('orderForm')).toBeInTheDocument()

    const orderForm = screen.getByTestId('orderForm')

    const passportInput = orderForm.querySelector('#passport')!
    userEvent.type(passportInput, '1234123123')
    const clientNameInput = orderForm.querySelector('#clientName')!
    userEvent.type(clientNameInput, 'ЦЦ ЦЦ ЦЦ')
    const birthDateInput = orderForm.querySelector('#birthDate')!
    userEvent.type(birthDateInput, '01011990')
    const phoneNumberInput = orderForm.querySelector('#phoneNumber')!

    await act(async () => {
      userEvent.type(phoneNumberInput, '001231234')
    })
    const findOrderBtn = screen.getByText('Найти')

    await act(async () => {
      userEvent.click(findOrderBtn)
    })

    expect(mockClearOrder).toHaveBeenCalled()
    expect(mockRefetch).toHaveBeenCalled()
  })

  it('Если на форме НЕ изменились данные, то при создании заявки, заявка в сторе НЕ перезаписывается', async () => {
    const mockStateWithData = {
      order: {
        order: {
          passportSeries: '2222',
          passportNumber: '222222',
          lastName: 'lastName',
          firstName: 'firstName',
          middleName: 'middleName',
          birthDate: '2000-01-01',
          phoneNumber: '79999999999',
        },
      },
    }

    mockedUseFindApplications.mockImplementation(() => ({
      isSuccess: true,
      isLoading: false,
      data: undefined,
      refetch: mockRefetch,
      remove: jest.fn(),
    }))

    jest.spyOn(Hooks, 'useCheckIfSberClient').mockImplementation(useCheckIfSberClientCreator(true))
    const mockSetOrder = jest.spyOn(orderSlice, 'setOrder')

    render(<OrderSearching nextStep={nextStep} onApplicationOpen={onApplicationOpen} onMount={onMount} />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <MockProviders mockStore={mockStoreCreator(mockStateWithData)}>{children}</MockProviders>
      ),
    })

    expect(screen.getByTestId('orderForm')).toBeInTheDocument()
    expect(screen.getByTestId('newOrderForm')).toBeInTheDocument()

    const createOrderBtn = screen.getByText('Создать заявку')

    await act(async () => {
      userEvent.click(createOrderBtn)
    })

    expect(mockSetOrder).not.toHaveBeenCalled()
    expect(nextStep).toHaveBeenCalled()
  })

  it('Если на форме изменились данные, то при создании заявки, заявка записывается в стор', async () => {
    const mockStateWithoutData = {
      order: {
        order: undefined,
      },
    }

    mockedUseFindApplications.mockImplementation(() => ({
      isSuccess: true,
      isLoading: false,
      data: undefined,
      refetch: mockRefetch,
      remove: jest.fn(),
    }))

    jest.spyOn(Hooks, 'useCheckIfSberClient').mockImplementation(useCheckIfSberClientCreator(true))
    const mockSetOrder = jest.spyOn(orderSlice, 'setOrder')

    render(<OrderSearching nextStep={nextStep} onApplicationOpen={onApplicationOpen} onMount={onMount} />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <MockProviders mockStore={mockStoreCreator(mockStateWithoutData)}>{children}</MockProviders>
      ),
    })

    expect(screen.getByTestId('orderForm')).toBeInTheDocument()
    expect(screen.queryByTestId('newOrderForm')).not.toBeInTheDocument()

    const orderForm = screen.getByTestId('orderForm')

    const passportInput = orderForm.querySelector('#passport')!
    userEvent.type(passportInput, '1234123123')
    const clientNameInput = orderForm.querySelector('#clientName')!
    userEvent.type(clientNameInput, 'ЦЦ ЦЦ ЦЦ')
    const birthDateInput = orderForm.querySelector('#birthDate')!
    userEvent.type(birthDateInput, '01011990')
    const phoneNumberInput = orderForm.querySelector('#phoneNumber')!

    await act(async () => {
      userEvent.type(phoneNumberInput, '001231234')
    })

    const findOrderBtn = screen.getByText('Найти')
    await act(async () => {
      userEvent.click(findOrderBtn)
    })

    expect(screen.getByTestId('newOrderForm')).toBeInTheDocument()

    const createOrderBtn = screen.getByText('Создать заявку')
    await act(async () => {
      userEvent.click(createOrderBtn)
    })

    expect(mockSetOrder).toHaveBeenCalled()
    expect(nextStep).toHaveBeenCalled()
  })
})
