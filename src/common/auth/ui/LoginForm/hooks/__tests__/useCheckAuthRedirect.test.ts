import { renderHook } from '@testing-library/react-hooks'
import { URLSearchParamsInit, useNavigate, useSearchParams } from 'react-router-dom'

import * as authdcApi from 'shared/api/requests/authdc'
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

const useNavigateMock = useNavigate as jest.MockedFunction<typeof useNavigate>
const useSearchParamsMock = useSearchParams as jest.MockedFunction<typeof useSearchParams>
const navigateMock = jest.fn()

const createSessionMock = jest.spyOn(authdcApi, 'createSession')

describe('useCheckAuthRedirect', () => {
  const onRejectMock = jest.fn()
  const defaultCode = '123'
  const defaultState = '321'

  /** Работает в связке с моком setSearchParams,
  имитирует установку квери параметров в браузерной строке */
  let query = `code=${defaultCode}&state=${defaultState}`
  beforeEach(() => {
    const setSearchParams = (value: URLSearchParams): URLSearchParamsInit => {
      query = value.toString()

      return query
    }
    //@ts-ignore
    useSearchParamsMock.mockImplementation(() => [new URLSearchParams(query), setSearchParams])
    useNavigateMock.mockImplementation(() => navigateMock)
    createSessionMock.mockReset()
    onRejectMock.mockReset()
    jest.clearAllMocks()
  })

  it('при наличии code и state создаем сессию', async () => {
    createSessionMock.mockImplementation(async () => ({
      data: {},
      success: true,
    }))
    const { result, waitForNextUpdate } = renderHook(() => useCheckAuthRedirect(onRejectMock))
    expect(result.current.isLoading).toBe(true)
    await waitForNextUpdate()
    expect(createSessionMock).toHaveBeenCalledWith({
      authCode: defaultCode,
      state: defaultState,
    })
    expect(navigateMock).toHaveBeenCalledWith(appRoutePaths.vendorList)
    expect(result.current.isLoading).toBe(false)
  })
})
