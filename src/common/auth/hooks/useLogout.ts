import { useCallback, useEffect, useState } from 'react'

import Cookies from 'js-cookie'
import { useSnackbar, VariantType } from 'notistack'
import { useQuery, useQueryClient } from 'react-query'

import { COOKIE_POINT_OF_SALE } from 'entities/pointOfSale/constants'
import { clearOrder } from 'entities/reduxStore/orderSlice'
import { removeUserInfo } from 'entities/user/model/userSlice'
import { getStateAndNonce } from 'shared/api/requests/authsberteamid'
import { authToken } from 'shared/api/token'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'

import { useAuthContext } from '../ui/AuthProvider'

export const useLogout = (parentlogoutUrl?: string) => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logoutUrl } = useAuthContext()

  const { enqueueSnackbar } = useSnackbar()

  const redirectToLogoutUrl = useCallback(() => {
    const url = logoutUrl || parentlogoutUrl
    if (url) {
      window.location.assign(url)
    }
  }, [logoutUrl, parentlogoutUrl])

  const onLogout = useCallback(
    (message?: { text: string; variant?: VariantType }) => {
      const isTokens = authToken.jwt.get() && authToken.refresh.get()

      // Чистим данные стора
      dispatch(removeUserInfo())
      dispatch(clearOrder())

      // Чистим куки
      authToken.jwt.delete()
      authToken.refresh.delete()
      Cookies.remove(COOKIE_POINT_OF_SALE)

      //Чистим кеш
      queryClient.invalidateQueries()

      if (isTokens) {
        if (message?.text) {
          enqueueSnackbar(message.text, { variant: message.variant ?? 'error' })
          setTimeout(redirectToLogoutUrl, 1000)
        }
      } else {
        redirectToLogoutUrl()
      }
    },
    [dispatch, enqueueSnackbar, queryClient, redirectToLogoutUrl],
  )

  return { onLogout }
}
