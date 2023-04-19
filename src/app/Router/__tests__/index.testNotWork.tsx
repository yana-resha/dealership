import React from 'react'

import { render, waitFor, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import { store } from 'app/store'
import * as CheckToken from 'common/auth/hooks/useCheckToken'
import * as CheckPoint from 'entities/pointOfSale/hooks/useCheckPointOfSale'
import { MockThemeProviders } from 'tests/mocks'

import { Router } from '../Router'

const useCheckToken = jest.spyOn(CheckToken, 'useCheckToken')
const useCheckPointOfSale = jest.spyOn(CheckPoint, 'useCheckPointOfSale')

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
    useCheckToken.mockImplementation(() => true)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Проверяем, если пользователь авторизован, то отображается главный рабочий экран', async () => {
    useCheckToken.mockImplementation(() => true)
    useCheckPointOfSale.mockImplementation(() => true)

    render(getMockRouter())

    await waitFor(() => expect(screen.getByTestId('dealershipPage')).toBeInTheDocument(), {
      timeout: 1000,
    })
  })

  it('Проверяем, если пользователь НЕ авторизован, то отображается экран авторизации', async () => {
    useCheckToken.mockImplementation(() => false)

    render(getMockRouter())

    await waitFor(() => expect(screen.getByTestId('authPage')).toBeInTheDocument(), {
      timeout: 1000,
    })
  })
})
