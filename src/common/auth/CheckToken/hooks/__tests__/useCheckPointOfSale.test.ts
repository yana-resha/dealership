import { renderHook } from '@testing-library/react-hooks'
import { COOKIE_POINT_OF_SALE } from 'entities/constants/auth.constants'
import Cookies from 'js-cookie'

import { useCheckPointOfSale } from '../useCheckPointOfSale'

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}))

jest.useFakeTimers()

describe('useCheckPointOfSale', () => {
  afterEach(() => {
    Cookies.remove(COOKIE_POINT_OF_SALE)
  })

  it('возвращает true, если в куках есть токен', () => {
    Cookies.set(
      COOKIE_POINT_OF_SALE,
      JSON.stringify({
        vendorCode: '2002852',
        vendorName: 'Сармат',
        cityName: 'Ханты-Мансийск',
        houseNumber: '4',
        streetName: 'Зябликова',
      }),
    )

    const { result } = renderHook(() => useCheckPointOfSale())

    expect(result.current).toBe(true)
  })

  it('возвращает false, если в куках нет токена', () => {
    const { result } = renderHook(() => useCheckPointOfSale())

    expect(result.current).toBe(false)
  })

  it('обновляет состояние токена при изменении токена в куках', () => {
    const { result } = renderHook(() => useCheckPointOfSale())

    Cookies.set(
      COOKIE_POINT_OF_SALE,
      JSON.stringify({
        vendorCode: '4003390',
        vendorName: 'ХимкиАвто',
        cityName: 'Саратов',
        houseNumber: '2',
        streetName: 'Симонова',
      }),
    )
    jest.advanceTimersByTime(750)

    expect(result.current).toBe(true)
  })

  it('удаляет интервал при размонтировании компонента', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval')

    const { unmount } = renderHook(() => useCheckPointOfSale())

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})
