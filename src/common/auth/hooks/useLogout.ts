import { useCallback } from 'react'

import Cookies from 'js-cookie'

import { COOKIE_POINT_OF_SALE } from 'entities/pointOfSale/constants'
import { removeUserInfo } from 'entities/user/model/userSlice'
import { authToken } from 'shared/api/token'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'

export const useLogout = () => {
  const dispatch = useAppDispatch()

  const onLogout = useCallback(() => {
    dispatch(removeUserInfo())

    authToken.jwt.delete()
    authToken.refresh.delete()
    Cookies.remove(COOKIE_POINT_OF_SALE)
  }, [dispatch])

  return { onLogout }
}
