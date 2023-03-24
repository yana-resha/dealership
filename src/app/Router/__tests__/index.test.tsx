import React from 'react'

import { render, waitFor, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/styles'

import { useCheckToken } from 'common/auth/CheckToken'
import { store } from 'store'
import { theme } from 'app/theme'

import { Router } from '../Router'

jest.mock('common/auth/CheckToken', () => {
  const originalModule = jest.requireActual('common/auth/CheckToken')
  
  return {
    ...originalModule,
    useCheckToken: jest.fn(),
  }
})

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
    (useCheckToken as jest.Mock).mockImplementation(() => true)
  })
  
  afterEach(() => {
    jest.clearAllMocks()
  })
      
  it('Проверяем, если пользователь авторизован, то отображается главный рабочий экран', async () => {
    (useCheckToken as jest.Mock).mockImplementation(() => true)

    render(getMockRouter())

    await waitFor(() => expect(screen.getByTestId('dealershipPage')).toBeInTheDocument(), {
      timeout: 1000,
    })
  })

  it('Проверяем, если пользователь НЕ авторизован, то отображается экран авторизации', async () => {
    (useCheckToken as jest.Mock).mockImplementation(() => false)

    render(getMockRouter())

    await waitFor(() => expect(screen.getByTestId('authPage')).toBeInTheDocument(), {
      timeout: 1000,
    })
  })
})
