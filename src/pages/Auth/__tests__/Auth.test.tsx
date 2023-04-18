import React from 'react'

import { render, screen } from '@testing-library/react'

import { MockProviders } from 'tests/mocks'

import { Auth } from '../Auth'

jest.mock('common/auth/ui/LoginForm/LoginForm.tsx')

describe('AuthPage', () => {
  it('отрисовывает форму авторизации', () => {
    render(
      <MockProviders>
        <Auth />
      </MockProviders>,
    )

    const loginForm = screen.getByTestId('loginForm')
    expect(loginForm).toBeInTheDocument()
  })
})
