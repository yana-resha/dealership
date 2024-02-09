import { render } from '@testing-library/react'

import { Rest } from 'shared/api/client'
import { MockProviders } from 'tests/mocks'

import * as useLogoutHooks from '../../../hooks/useLogout'
import { AuthProvider } from '../AuthProvider'

// Создаем мок-объекты для Rest и useLogout
jest.mock('shared/api/client')
jest.mock('../../../hooks/useLogout')

const mockEnqueue = jest.fn()
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueue,
  }),
}))

describe('AuthProvider', () => {
  const useLogoutMock = jest.spyOn(useLogoutHooks, 'useLogout')
  const logoutMock = jest.fn()
  beforeEach(() => {
    useLogoutMock.mockImplementation(() => ({ logout: logoutMock }))
    jest.clearAllMocks()
  })
  it('должен настроить клиент Rest с правильной функцией logout-а', () => {
    render(
      <MockProviders>
        <AuthProvider>
          <div>Дочерний компонент</div>
        </AuthProvider>
      </MockProviders>,
    )
    expect(Rest.setLogout).toHaveBeenCalledTimes(1)
  })
})
