import { useCallback } from 'react'

import Cookies from 'js-cookie'
import { useSnackbar, VariantType } from 'notistack'
import { useQueryClient } from 'react-query'

import { COOKIE_POINT_OF_SALE } from 'entities/pointOfSale/constants'
import { clearOrder } from 'entities/reduxStore/orderSlice'
import { removeUserInfo } from 'entities/user/model/userSlice'
import { checkIsAuth, removeAuthCookie } from 'shared/api/helpers/authCookie'
import { deleteSession } from 'shared/api/requests/authdc'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'

import { useAuthContext } from '../ui/AuthProvider'

export const useLogout = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logoutUrl } = useAuthContext()

  const { enqueueSnackbar } = useSnackbar()

  const redirectToLogoutUrl = useCallback(() => {
    const url = logoutUrl
    if (url) {
      window.location.assign(url)
    }
  }, [logoutUrl])

  const logout = useCallback(
    (errorMessage?: string) => {
      const isAuth = checkIsAuth()

      // Так как AUTH_COOKIE мы удаляем только тут, то если его нет, то можно с уверенностью утверждать,
      // что onLogout уже был вызван
      if (!isAuth) {
        return
      }

      // Чистим данные стора
      dispatch(removeUserInfo())
      dispatch(clearOrder())

      // Чистим кеш
      queryClient.invalidateQueries()

      // Чистим куки
      Cookies.remove(COOKIE_POINT_OF_SALE)
      removeAuthCookie()

      deleteSession()
      redirectToLogoutUrl()

      if (isAuth) {
        if (errorMessage) {
          enqueueSnackbar(errorMessage, { variant: 'error' })
          setTimeout(redirectToLogoutUrl, 1000)
        }
      } else {
        redirectToLogoutUrl()
      }
    },
    [dispatch, enqueueSnackbar, queryClient, redirectToLogoutUrl],
  )

  return { logout }
}
