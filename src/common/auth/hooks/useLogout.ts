import { useCallback } from 'react'

import Cookies from 'js-cookie'
import { useQueryClient } from 'react-query'

import { COOKIE_POINT_OF_SALE } from 'entities/pointOfSale/constants'
import { removeUserInfo } from 'entities/user/model/userSlice'
import { clearOrder } from 'pages/CreateOrderPage/model/orderSlice'
import { authToken } from 'shared/api/token'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'

export const useLogout = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const onLogout = useCallback(() => {
    // Чистим данные стора
    dispatch(removeUserInfo())
    dispatch(clearOrder())

    // Чистим куки
    authToken.jwt.delete()
    authToken.refresh.delete()
    Cookies.remove(COOKIE_POINT_OF_SALE)

    //Чистим кеш
    queryClient.invalidateQueries()
  }, [dispatch, queryClient])

  return { onLogout }
}
