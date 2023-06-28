import { useCallback } from 'react'

import Cookies from 'js-cookie'
import { useSnackbar, VariantType } from 'notistack'
import { useQueryClient } from 'react-query'

import { COOKIE_POINT_OF_SALE } from 'entities/pointOfSale/constants'
import { removeUserInfo } from 'entities/user/model/userSlice'
import { clearOrder } from 'pages/CreateOrderPage/model/orderSlice'
import { authToken } from 'shared/api/token'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'

export const useLogout = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const { enqueueSnackbar } = useSnackbar()

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
        }
      }
    },
    [dispatch, enqueueSnackbar, queryClient],
  )

  return { onLogout }
}
