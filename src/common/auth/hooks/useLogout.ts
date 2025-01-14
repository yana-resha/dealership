import { useCallback } from 'react'

import Cookies from 'js-cookie'
import { useSnackbar } from 'notistack'
import { useQueryClient } from 'react-query'

import { appConfig } from 'config'
import { clearOrder } from 'entities/order'
import { COOKIE_POINT_OF_SALE } from 'entities/pointOfSale/constants'
import { removeUserInfo } from 'entities/user/model/userSlice'
import { checkIsAuth, removeAuthCookie } from 'shared/api/helpers/authCookie'
import { deleteSession, trainingLogout } from 'shared/api/requests/authdc'
import { AUTH_TOKEN } from 'shared/constants/constants'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { removeLocalStorage } from 'shared/lib/helpers'
import { sleep } from 'shared/lib/sleep'
import { clearTableSessions } from 'shared/tableCurrentPage/utils'

import { useAuthContext } from '../ui/AuthProvider'

export const useLogout = (beforeRedirectCb?: () => Promise<void>) => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logoutUrl } = useAuthContext()

  const { enqueueSnackbar } = useSnackbar()

  const redirectToLogoutUrl = useCallback(async () => {
    if (logoutUrl) {
      window.location.assign(logoutUrl)
    }
  }, [logoutUrl])

  const logout = useCallback(
    async (errorMessage?: string) => {
      const isAuth = checkIsAuth()

      // Так как AUTH_COOKIE мы удаляем только тут, то если его нет, то можно с уверенностью утверждать,
      // что onLogout уже был вызван
      if (!isAuth) {
        return
      }
      // Чистим данные стора
      dispatch(removeUserInfo())
      dispatch(clearOrder())

      if (isAuth && errorMessage) {
        enqueueSnackbar(errorMessage, { variant: 'error' })
        if (logoutUrl) {
          // Нужна задержка, чтобы пользователь успел прочитать сообщение перед редиректом на другой домен
          await sleep(1000)
        }
      }
      if (beforeRedirectCb) {
        await beforeRedirectCb()
      }

      // Чистим куки
      Cookies.remove(COOKIE_POINT_OF_SALE)
      removeLocalStorage(AUTH_TOKEN)
      removeAuthCookie()
      clearTableSessions()
      // т.к. в прилоджении производится проверка isAuth, то на этом этапе
      // будет произведен редирект на страницу авторизации

      if (appConfig.sberTeamAuthEnv === 'training') {
        trainingLogout()
      } else {
        deleteSession()
      }
      redirectToLogoutUrl()

      // Чистим кеш queryClient
      queryClient.invalidateQueries()
    },
    [beforeRedirectCb, dispatch, enqueueSnackbar, logoutUrl, queryClient, redirectToLogoutUrl],
  )

  return { logout }
}
