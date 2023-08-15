import { renderHook } from '@testing-library/react-hooks'
import Cookies from 'js-cookie'
import { act } from 'react-dom/test-utils'

import { authToken } from 'shared/api/token'
import { COOKIE_JWT_TOKEN } from 'shared/api/token'

import { useCheckToken } from '../useCheckToken'

const mockOnLogout = jest.fn()
jest.mock('../useLogout', () => ({ useLogout: () => ({ onLogout: mockOnLogout }) }))

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}))

describe('useCheckToken', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    Cookies.remove(COOKIE_JWT_TOKEN)
  })

  it('возвращает true, если в куках есть токен', () => {
    Cookies.set(COOKIE_JWT_TOKEN, 'test-token')

    const { result } = renderHook(() => useCheckToken(undefined))

    expect(result.current).toBe(true)
  })

  it('возвращает false, если в куках нет токена', () => {
    const { result } = renderHook(() => useCheckToken(undefined))

    expect(result.current).toBe(false)
  })

  it('обновляет состояние токена при изменении токена в куках', () => {
    const { result } = renderHook(() => useCheckToken(undefined))

    Cookies.set(COOKIE_JWT_TOKEN, 'new-test-token')
    jest.advanceTimersByTime(750)

    expect(result.current).toBe(true)
  })

  it('удаляет интервал при размонтировании компонента', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval')

    const { unmount } = renderHook(() => useCheckToken(undefined))

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })

  it('вызывается onLogout когда токен протухает', () => {
    const getTokenMock = jest.spyOn(authToken.jwt, 'get').mockImplementation(() => 'token')

    renderHook(() => useCheckToken(undefined))

    getTokenMock.mockImplementation(() => '')

    act(() => {
      jest.advanceTimersByTime(550)
    })

    expect(mockOnLogout).toHaveBeenCalledTimes(1)
  })
})
