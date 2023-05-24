import { renderHook, act } from '@testing-library/react-hooks'
import Cookies from 'js-cookie'

import { COOKIE_POINT_OF_SALE } from 'entities/pointOfSale/constants'
import * as userSlice from 'entities/user/model/userSlice'
import * as orderSlice from 'pages/CreateOrderPage/model/orderSlice'
import { COOKIE_JWT_TOKEN, COOKIE_REFRESH_TOKEN } from 'shared/api/token'
import { MockProviders } from 'tests/mocks'

import { useLogout } from '../useLogout'

jest.mock('shared/hooks/store/useAppDispatch', () => ({ useAppDispatch: () => (param: any) => {} }))

jest.mock('js-cookie', () => ({
  remove: jest.fn(),
}))

describe('useLogout', () => {
  const mockRemoveUserInfo = jest.spyOn(userSlice, 'removeUserInfo')
  const mockClearOrder = jest.spyOn(orderSlice, 'clearOrder')

  it('токены авторизации и точки продаж пользователя удаляется из cookie при выходе из системы', () => {
    const { result } = renderHook(() => useLogout(), { wrapper: MockProviders })

    act(() => {
      result.current.onLogout()
    })

    expect(mockRemoveUserInfo).toHaveBeenCalled()
    expect(mockClearOrder).toHaveBeenCalled()

    expect(Cookies.remove).toBeCalledTimes(3)
    expect(Cookies.remove).toHaveBeenNthCalledWith(1, COOKIE_JWT_TOKEN)
    expect(Cookies.remove).toHaveBeenNthCalledWith(2, COOKIE_REFRESH_TOKEN)
    expect(Cookies.remove).toHaveBeenNthCalledWith(3, COOKIE_POINT_OF_SALE)
  })
})
