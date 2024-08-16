import { renderHook, act } from '@testing-library/react-hooks'
import Cookies from 'js-cookie'

import * as orderSlice from 'entities/order/model/orderSlice'
import { COOKIE_POINT_OF_SALE } from 'entities/pointOfSale/constants'
import * as userSlice from 'entities/user/model/userSlice'
import { AUTH_COOKIE } from 'shared/api/helpers/authCookie'
import * as authdcModule from 'shared/api/requests/authdc'
import { MockProviders, StoreProviderMock } from 'tests/mocks'

import { useLogout } from '../useLogout'

const mockEnqueue = jest.fn()
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueue,
  }),
}))

jest.mock('shared/hooks/store/useAppDispatch', () => ({ useAppDispatch: () => (param: any) => {} }))

jest.mock('js-cookie', () => ({
  remove: jest.fn(),
  get: () => 'true',
}))

const mockRemoveUserInfo = jest.spyOn(userSlice, 'removeUserInfo')
const mockClearOrder = jest.spyOn(orderSlice, 'clearOrder')
const mockDeleteSession = jest.spyOn(authdcModule, 'deleteSession')

describe('useLogout', () => {
  it('токены авторизации и точки продаж пользователя удаляется из cookie при выходе из системы', () => {
    const { result } = renderHook(() => useLogout(), { wrapper: MockProviders })
    act(() => {
      result.current.logout()
    })
    expect(mockRemoveUserInfo).toHaveBeenCalled()
    expect(mockClearOrder).toHaveBeenCalled()
    expect(Cookies.remove).toBeCalledTimes(2)
    expect(Cookies.remove).toHaveBeenNthCalledWith(1, COOKIE_POINT_OF_SALE)
    expect(Cookies.remove).toHaveBeenNthCalledWith(2, AUTH_COOKIE)
    expect(mockDeleteSession).toHaveBeenCalled()
  })
})
