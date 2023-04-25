import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { URLSearchParamsInit, useNavigate, useSearchParams } from 'react-router-dom'

import * as request from 'common/auth/api/requests'
import { authToken } from 'shared/api/token'
import { appRoutePaths } from 'shared/navigation/routerPath'

import { useCheckAuthRedirect } from '../useCheckAuthRedirect'

// Мокаем навигацию
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
}))

// Мокаем sleep
jest.mock('shared/lib/sleep', () => ({
  sleep: jest.fn(),
}))

// Мокаем authToken
jest.mock('shared/api/token', () => ({
  authToken: {
    jwt: {
      save: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    },
    refresh: {
      save: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

const useNavigateMock = useNavigate as jest.MockedFunction<typeof useNavigate>
const useSearchParamsMock = useSearchParams as jest.MockedFunction<typeof useSearchParams>
const navigateMock = jest.fn()

const getTokenMock = jest.spyOn(request, 'getToken')

describe('useCheckAuthRedirect', () => {
  const onRejectMock = jest.fn()

  const defaultCode = '123'
  const defaultState = '321'
  /** Работает в связке с моком setSearchParams, имитирует установку квери параметров в браузерной строке */
  let query = `code=${defaultCode}&state=${defaultState}`

  beforeEach(() => {
    const setSearchParams = (value: URLSearchParams): URLSearchParamsInit => {
      query = value.toString()

      return query
    }
    //@ts-ignore
    useSearchParamsMock.mockImplementation(() => [new URLSearchParams(query), setSearchParams])

    useNavigateMock.mockImplementation(() => navigateMock)
    getTokenMock.mockReset()
    onRejectMock.mockReset()
    jest.clearAllMocks()
  })

  it('при наличии code и state получаем токены и сохраняем их', async () => {
    getTokenMock.mockImplementation(async () => ({
      jwtAccessToken: 'fake_jwt_token',
      refreshToken: 'fake_refresh_token',
    }))

    const { result, waitForNextUpdate } = renderHook(() => useCheckAuthRedirect(onRejectMock))

    expect(result.current.isLoading).toBe(true)

    await waitForNextUpdate()

    expect(getTokenMock).toHaveBeenCalledWith({
      authCode: defaultCode,
      state: defaultState,
    })
    expect(authToken.jwt.save).toHaveBeenCalledWith('fake_jwt_token')
    expect(authToken.refresh.save).toHaveBeenCalledWith('fake_refresh_token')
    expect(navigateMock).toHaveBeenCalledWith(appRoutePaths.vendorList)
    expect(result.current.isLoading).toBe(false)
  })
})
