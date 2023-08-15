import { renderHook } from '@testing-library/react-hooks'

import { Rest } from 'shared/api/client'
import * as checkJwtFreshes from 'shared/api/helpers/checkJwtFresh'
import { MockProviders } from 'tests/mocks'

import * as useAuthContextHooks from '../../ui/AuthProvider/context'
import { useRefreshControl } from '../useRefreshControl'

jest.mock('shared/api/token', () => ({ authToken: { jwt: { get: () => 'jwt_token' } } }))
jest.mock('shared/api/client')

const useAuthContextToken = jest.spyOn(useAuthContextHooks, 'useAuthContext')
const mockCheckJwtFresh = jest.spyOn(checkJwtFreshes, 'checkJwtFresh')

describe('useRefreshControl', () => {
  beforeEach(() => {
    useAuthContextToken.mockImplementation(() => ({
      isAuth: true,
      logoutUrl: undefined,
      setLogoutUrl: () => undefined,
    }))
    mockCheckJwtFresh.mockImplementation(() => true)
  })

  it('Проверяем, что refresh не вызывается если пользователь не залогинен', () => {
    useAuthContextToken.mockImplementation(() => ({
      isAuth: false,
      logoutUrl: undefined,
      setLogoutUrl: () => undefined,
    }))
    mockCheckJwtFresh.mockImplementation(() => false)

    renderHook(() => useRefreshControl(), { wrapper: MockProviders })

    expect(Rest.refresh).not.toBeCalled()
  })

  it('Проверяем, что refresh не вызывается если пользователь залогинен и токен свежий', () => {
    useAuthContextToken.mockImplementation(() => ({
      isAuth: true,
      logoutUrl: undefined,
      setLogoutUrl: () => undefined,
    }))
    mockCheckJwtFresh.mockImplementation(() => true)

    renderHook(() => useRefreshControl(), { wrapper: MockProviders })

    expect(Rest.refresh).not.toBeCalled()
  })

  it('Проверяем, что refresh вызывается если пользователь залогинен и токен протух', () => {
    useAuthContextToken.mockImplementation(() => ({
      isAuth: true,
      logoutUrl: undefined,
      setLogoutUrl: () => undefined,
    }))
    mockCheckJwtFresh.mockImplementation(() => false)

    renderHook(() => useRefreshControl(), { wrapper: MockProviders })

    expect(Rest.refresh).toBeCalled()
  })
})
