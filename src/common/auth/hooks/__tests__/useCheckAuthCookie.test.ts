import { renderHook } from '@testing-library/react-hooks'
import Cookies from 'js-cookie'
import { act } from 'react-dom/test-utils'

import { AUTH_COOKIE } from 'shared/api/helpers/authCookie'

import { useCheckAuthCookie } from '../useCheckAuthCookie'

const mockLogout = jest.fn()
jest.mock('../useLogout', () => ({ useLogout: () => ({ onLogout: mockLogout }) }))

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}))

describe('useCheckAuthCookie', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })
  afterEach(() => {
    Cookies.remove(AUTH_COOKIE)
  })
  it('возвращает true, если в куках есть AUTH_COOKIE', () => {
    Cookies.set(AUTH_COOKIE, 'true')
    const { result } = renderHook(() => useCheckAuthCookie(mockLogout))
    expect(result.current).toBe(true)
  })
  it('возвращает false, если в куках нет AUTH_COOKIE', () => {
    const { result } = renderHook(() => useCheckAuthCookie(mockLogout))
    expect(result.current).toBe(false)
  })
  it('обновляет состояние isAuth при изменении AUTH_COOKIE в куках', () => {
    const { result } = renderHook(() => useCheckAuthCookie(mockLogout))
    Cookies.set(AUTH_COOKIE, 'true')

    jest.advanceTimersByTime(750)
    expect(result.current).toBe(true)
  })
  it('удаляет интервал при размонтировании компонента', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval')
    const { unmount } = renderHook(() => useCheckAuthCookie(mockLogout))
    unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()
  })
  it('вызывается onLogout когда AUTH_COOKIE удаляется из куков', () => {
    Cookies.set(AUTH_COOKIE, 'true')
    renderHook(() => useCheckAuthCookie(mockLogout))
    Cookies.remove(AUTH_COOKIE)

    act(() => {
      jest.advanceTimersByTime(550)
    })
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })
})
