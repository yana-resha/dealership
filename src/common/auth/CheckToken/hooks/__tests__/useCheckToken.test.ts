import { renderHook } from '@testing-library/react-hooks'
import Cookies from 'js-cookie'

import { COOKIE_USER_TOKEN } from '../../../LoginForm/LoginForm.constants'

import { useCheckToken } from '../useCheckToken'

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}))

jest.useFakeTimers()

describe('useCheckToken', () => {
  afterEach(() => {
    Cookies.remove(COOKIE_USER_TOKEN)
  })

  it('возвращает true, если в куках есть токен', () => {
    Cookies.set(COOKIE_USER_TOKEN, 'test-token')

    const { result } = renderHook(() => useCheckToken())

    expect(result.current).toBe(true)
  })

  it('возвращает false, если в куках нет токена', () => {
    const { result } = renderHook(() => useCheckToken())

    expect(result.current).toBe(false)
  })

  it('обновляет состояние токена при изменении токена в куках', () => {
    const { result } = renderHook(() => useCheckToken())

    Cookies.set(COOKIE_USER_TOKEN, 'new-test-token')
    jest.advanceTimersByTime(750)

    expect(result.current).toBe(true)
  })

  it('удаляет интервал при размонтировании компонента', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval')

    const { unmount } = renderHook(() => useCheckToken())

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})
