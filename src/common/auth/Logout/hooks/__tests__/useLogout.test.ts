import { renderHook, act } from '@testing-library/react-hooks'
import Cookies from 'js-cookie'

import { useLogout } from '../useLogout'

jest.mock('js-cookie', () => ({
  remove: jest.fn(),
}))

describe('useLogout', () => {
  it('токен пользователя удаляется из cookie при выходе из системы', () => {
    const { result } = renderHook(() => useLogout())

    act(() => {
      result.current.onLogout()
    })

    expect(Cookies.remove).toHaveBeenCalledTimes(1)
  })
})
