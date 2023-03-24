import React from 'react'

import { render, waitFor, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/styles'

import * as CheckToken from 'common/auth/CheckToken/hooks/useCheckToken'
import { store } from 'store'
import { theme } from 'app/theme'

import { Router } from '../Router'
import * as CheckPoint from 'common/auth/CheckToken/hooks/useCheckPointOfSale'

const useCheckToken = jest.spyOn(CheckToken, 'useCheckToken')
const useCheckPointOfSale = jest.spyOn(CheckPoint, 'useCheckPointOfSale')

const getMockRouter = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <MemoryRouter basename="/">
        <Router />
      </MemoryRouter>
    </ThemeProvider>
  </Provider>
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
