import React from 'react'

import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import { store } from 'app/store'
import * as authContext from 'common/auth/ui/AuthProvider/context'
import * as CheckPoint from 'entities/pointOfSale/hooks/useCheckPointOfSale'
import { MockThemeProviders } from 'tests/mocks'

import { Router } from '../Router'

const useAuthContextMock = jest.spyOn(authContext, 'useAuthContext')
const useCheckPointOfSale = jest.spyOn(CheckPoint, 'useCheckPointOfSale')

jest.mock('../Routers/MainRouter')
jest.mock('../Routers/AuthRouter')

const queryClient = new QueryClient()

const getMockRouter = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <MockThemeProviders>
        <MemoryRouter basename="/">
          <Router />
        </MemoryRouter>
      </MockThemeProviders>
    </Provider>
  </QueryClientProvider>
)

describe('Router component', () => {
  beforeEach(() => {
    // Переопределяем результаты работы методов перед каждым тестом
    useAuthContextMock.mockImplementation(() => ({
      isAuth: true,
      logoutUrl: undefined,
      setLogoutUrl: () => undefined,
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Проверяем, если пользователь авторизован, то отображается главный рабочий экран', async () => {
    useAuthContextMock.mockImplementation(() => ({
      isAuth: true,
      logoutUrl: undefined,
      setLogoutUrl: () => undefined,
    }))
    useCheckPointOfSale.mockImplementation(() => true)

    render(getMockRouter())

    expect(await screen.findByTestId('dealershipPage')).toBeInTheDocument()
  })
  it('Проверяем, если пользователь НЕ авторизован, то отображается экран авторизации', async () => {
    useAuthContextMock.mockImplementation(() => ({
      isAuth: false,
      logoutUrl: undefined,
      setLogoutUrl: () => undefined,
    }))

    render(getMockRouter())

    expect(await screen.findByTestId('authPage')).toBeInTheDocument()
  })
})
