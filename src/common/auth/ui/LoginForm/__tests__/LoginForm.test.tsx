import React from 'react'

import { render, screen } from '@testing-library/react'

import { MockProviders } from 'tests/mocks'

import { LoginForm } from '../LoginForm'
import * as LoginFormHooks from '../LoginForm.hooks'

const mockedUseGetAuthLink = jest.spyOn(LoginFormHooks, 'useGetAuthLink')
mockedUseGetAuthLink.mockImplementation(jest.fn())

const authLink = 'www.link.ru'

describe('LoginForm', () => {
  beforeEach(() => {
    mockedUseGetAuthLink.mockImplementation(() => ({
      isLoading: false,
      error: undefined,
      authLink,
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

  it('отображает индикатор загрузки в кнопке, когда isLoading равно true', () => {
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

    const circularProgress = screen.getByRole('progressbar')
    expect(circularProgress).toBeInTheDocument()
  })

  it('не отображает индикатор загрузки в кнопке, когда isLoading равно false', () => {
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

    const textBtn = screen.getByText('Войти по Сбер ID')
    expect(textBtn).toBeInTheDocument()
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
