import { render } from '@testing-library/react'

import { Rest } from 'shared/api/client/client'
import { MockProviders } from 'tests/mocks'

import * as requests from '../../../api/requests'
import * as useLogoutHooks from '../../../hooks/useLogout'
import { AuthProvider } from '../AuthProvider'

// Создаем мок-объекты для Rest, refreshAuthByToken и useLogout
jest.mock('shared/api/client/client')
jest.mock('../../../api/requests')
jest.mock('../../../hooks/useLogout')

describe('AuthProvider', () => {
  const useLogoutMock = jest.spyOn(useLogoutHooks, 'useLogout')
  const onLogoutMock = jest.fn()

  const refreshAuthByTokenMock = jest.spyOn(requests, 'refreshAuthByToken')

  beforeEach(() => {
    // Устанавливаем возвращаемое значение для refreshAuthByToken
    useLogoutMock.mockImplementation(() => ({ onLogout: onLogoutMock }))
    jest.clearAllMocks()
  })

  it('должен настроить клиент Rest с правильной функцией обновления токена', async () => {
    render(
      <MockProviders>
        <AuthProvider>
          <div>Дочерний компонент</div>
        </AuthProvider>
      </MockProviders>,
    )

    expect(Rest.setRefresh).toHaveBeenCalledTimes(1)
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
    expect(Rest.setLogout).toHaveBeenCalledWith(onLogoutMock)
  })

  it('должен настроить клиент Rest с правильной функцией logout-а', () => {
    render(
      <MockProviders>
        <AuthProvider>
          <div>Дочерний компонент</div>
        </AuthProvider>
      </MockProviders>,
    )

    expect(Rest.setRefresh).toHaveBeenCalledTimes(1)
    expect(Rest.setRefresh).toHaveBeenCalledWith(refreshAuthByTokenMock)
  })
})
