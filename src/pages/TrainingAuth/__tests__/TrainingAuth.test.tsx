import React from 'react'

import { render, screen } from '@testing-library/react'

import { MockProviders } from 'tests/mocks'

import { TrainingAuth } from '../TrainingAuth'

jest.mock('common/auth/ui/LoginForm/LoginForm.tsx')

describe('TrainingAuth', () => {
  it('отрисовывает форму авторизации', () => {
    render(
      <MockProviders>
        <TrainingAuth />
      </MockProviders>,
    )

    const loginForm = screen.getByTestId('trainingLoginForm')
    expect(loginForm).toBeInTheDocument()
  })
})
