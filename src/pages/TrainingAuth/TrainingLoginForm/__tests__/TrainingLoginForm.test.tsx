import { TrainingCreateSessionRequest, TrainingCreateSessionResponse } from '@sberauto/authdc-proto/public'
import { render, screen } from '@testing-library/react'
import { UseMutationResult } from 'react-query'

import { CustomFetchError } from 'shared/api/client'
import * as authdcModule from 'shared/api/requests/authdc'
import { MockProviders } from 'tests/mocks'

import { TrainingLoginForm } from '../TrainingLoginForm'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}))

const mockedUseTrainingCreateSessionMutation = jest.spyOn(authdcModule, 'useTrainingCreateSessionMutation')

describe('TrainingLoginForm', () => {
  beforeEach(() => {
    mockedUseTrainingCreateSessionMutation.mockImplementation(
      () =>
        ({
          isLoading: false,
          mutate: jest.fn,
        } as unknown as UseMutationResult<
          TrainingCreateSessionResponse,
          CustomFetchError,
          TrainingCreateSessionRequest,
          unknown
        >),
    )
    render(
      <MockProviders>
        <TrainingLoginForm />
      </MockProviders>,
    )
  })

  it('отрисовывает форму', () => {
    const loginForm = screen.getByTestId('trainingLoginForm')
    expect(loginForm).toBeInTheDocument()
  })

  it('отрисовывает поля логин и пароль', () => {
    expect(screen.getByText('Логин')).toBeInTheDocument()
    expect(screen.getByText('Пароль')).toBeInTheDocument()
  })

  it('отрисовывает кнопку', () => {
    const loginButton = screen.getByTestId('loginButton')
    expect(loginButton).toBeInTheDocument()
  })

  it('отображает индикатор загрузки в кнопке, когда isTrainingCreateSessionMutateLoading равно true', () => {
    mockedUseTrainingCreateSessionMutation.mockImplementation(
      () =>
        ({
          isLoading: true,
          mutate: jest.fn,
        } as unknown as UseMutationResult<
          TrainingCreateSessionResponse,
          CustomFetchError,
          TrainingCreateSessionRequest,
          unknown
        >),
    )
    render(
      <MockProviders>
        <TrainingLoginForm />
      </MockProviders>,
    )

    expect(screen.getByTestId('circularProgressWheel')).toBeInTheDocument()
  })
})
