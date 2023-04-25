import { render } from '@testing-library/react'

import { Rest } from 'shared/api/client/client'

import * as useLogoutHooks from '../../../hooks/useLogout'
import { AuthProvider } from '../AuthProvider'

// Создаем мок-объекты для Rest, refreshAuthByToken и useLogout
jest.mock('shared/api/client/client')
jest.mock('../../../api/requests')
jest.mock('../../../hooks/useLogout')

describe('AuthProvider', () => {
  const useLogoutMock = jest.spyOn(useLogoutHooks, 'useLogout')
  const onLogoutMock = jest.fn()

  beforeEach(() => {
    // Устанавливаем возвращаемое значение для refreshAuthByToken
    useLogoutMock.mockImplementation(() => ({ onLogout: onLogoutMock }))
  })

  it('должен настроить клиент Rest с правильной функцией обновления токена', async () => {
    render(
      <AuthProvider>
        <div>Дочерний компонент</div>
      </AuthProvider>,
    )

    expect(Rest.setRefresh).toHaveBeenCalledTimes(1)
  })

  it('должен настроить клиент Rest с правильной функцией logout-а', () => {
    render(
      <AuthProvider>
        <div>Дочерний компонент</div>
      </AuthProvider>,
    )

    // Ожидаем, что функция Rest.setLogout была вызвана
    expect(Rest.setLogout).toHaveBeenCalledTimes(1)
    // Ожидаем, что функция Rest.setLogout была вызвана с правильным аргументом
    expect(Rest.setLogout).toHaveBeenCalledWith(onLogoutMock)
  })
})
