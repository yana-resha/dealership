import React from 'react'

import { render, screen } from '@testing-library/react'

import { MockProviders } from 'tests/mocks'

import * as useCheckAuthRedirectHooks from '../hooks/useCheckAuthRedirect'
import * as LoginFormHooks from '../hooks/useGetAuthLink'
import { LoginForm } from '../LoginForm'

const mockEnqueue = jest.fn()

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueue,
  }),
}))

const mockedUseGetAuthLink = jest.spyOn(LoginFormHooks, 'useGetAuthLink')
const mockUseCheckAuthRedirect = jest.spyOn(useCheckAuthRedirectHooks, 'useCheckAuthRedirect')
mockedUseGetAuthLink.mockImplementation(jest.fn())

const authLink = 'www.link.ru'

describe('LoginForm', () => {
  beforeEach(() => {
    mockedUseGetAuthLink.mockImplementation(() => ({
      isLoading: false,
      error: undefined,
      authLink,
    }))
    mockUseCheckAuthRedirect.mockImplementation(() => ({
      isLoading: false,
      isHasCodeAndState: false,
    }))
  })

  it('отрисовывает форму', () => {
    render(
      <MockProviders>
        <LoginForm />
      </MockProviders>,
    )

    const loginForm = screen.getByTestId('loginForm')
    expect(loginForm).toBeInTheDocument()
  })

  it('отрисовывает кнопку', () => {
    render(
      <MockProviders>
        <LoginForm />
      </MockProviders>,
    )

    const loginButton = screen.getByTestId('loginButton')
    expect(loginButton).toBeInTheDocument()
  })

  it('отображает индикатор загрузки в кнопке, когда UseGetAuthLink.isLoading равно true', () => {
    mockedUseGetAuthLink.mockImplementation(() => ({
      isLoading: true,
      error: undefined,
      authLink: '',
    }))

    render(
      <MockProviders>
        <LoginForm />
      </MockProviders>,
    )

    const circularProgress = screen.getByTestId('circularProgressWheel')
    expect(circularProgress).toBeInTheDocument()
  })

  it('отображает индикатор загрузки в кнопке, когда UseCheckAuthRedirect.isLoading равно true', () => {
    mockUseCheckAuthRedirect.mockImplementation(() => ({ isLoading: true, isHasCodeAndState: false }))

    render(
      <MockProviders>
        <LoginForm />
      </MockProviders>,
    )

    const circularProgress = screen.getByTestId('circularProgressWheel')
    expect(circularProgress).toBeInTheDocument()
  })

  it('не отображает индикатор загрузки в кнопке, когда isLoading равно false', () => {
    mockedUseGetAuthLink.mockImplementation(() => ({
      isLoading: false,
      error: undefined,
      authLink,
    }))
    mockUseCheckAuthRedirect.mockImplementation(() => ({
      isLoading: false,
      isHasCodeAndState: false,
    }))

    render(
      <MockProviders>
        <LoginForm />
      </MockProviders>,
    )

    const textBtn = screen.getByText('Войти')
    expect(textBtn).toBeInTheDocument()
  })

  it('Проверяем что были вызван хук получения ссылки', () => {
    mockedUseGetAuthLink.mockImplementation(() => ({
      isLoading: false,
      error: undefined,
      authLink,
    }))

    render(
      <MockProviders>
        <LoginForm />
      </MockProviders>,
    )

    expect(mockedUseGetAuthLink).toBeCalled()
  })

  it('Проверяем что были вызван хук получения токена', () => {
    mockUseCheckAuthRedirect.mockImplementation(() => ({
      isLoading: false,
      isHasCodeAndState: false,
    }))

    render(
      <MockProviders>
        <LoginForm />
      </MockProviders>,
    )

    expect(mockUseCheckAuthRedirect).toBeCalled()
  })

  it('отображает сообщение об ошибке если error', () => {
    mockedUseGetAuthLink.mockImplementation(() => ({
      isLoading: true,
      error: 'some error',
      authLink,
    }))

    render(
      <MockProviders>
        <LoginForm />
      </MockProviders>,
    )

    const loginErrorMessage = screen.getByTestId('loginErrorMessage')
    expect(loginErrorMessage).toBeInTheDocument()
  })

  it('не отображает сообщение об ошибке если нет ошибки', () => {
    mockedUseGetAuthLink.mockImplementation(() => ({
      isLoading: true,
      error: undefined,
      authLink,
    }))

    render(
      <MockProviders>
        <LoginForm />
      </MockProviders>,
    )

    const loginErrorMessage = screen.queryByTestId('loginErrorMessage')
    expect(loginErrorMessage).not.toBeInTheDocument()
  })

  it('если получили ссылку, то ссылка подставляется в кнопку', () => {
    const authLink = 'www.link.ru'
    mockedUseGetAuthLink.mockImplementation(() => ({
      isLoading: false,
      error: undefined,
      authLink,
    }))

    render(
      <MockProviders>
        <LoginForm />
      </MockProviders>,
    )

    const loginButton = screen.getByTestId('loginButton')
    expect(loginButton).toHaveAttribute('href', authLink)
  })
})
