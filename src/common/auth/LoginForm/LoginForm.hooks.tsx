import { useCallback, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

import { appRoutePaths } from 'app/Router/Router.utils'
import { COOKIE_USER_TOKEN } from '../../../entities/constants/auth.constants'

export const useAuthSberId = () => {
  const [isFetch, setIsFetch] = useState(false)

  const navigate = useNavigate()

  const onGoToSberAuth = useCallback(async () => {
    //TODO: Имитируем запрос на авторизацию https://jira.x.sberauto.com/browse/DCB-2
    try {
      setIsFetch(true)
      const res = await new Promise(resolve => {
        setTimeout(() => {
          resolve('ok')
        }, 750)
      })

      if (res === 'ok') {
        Cookies.set(COOKIE_USER_TOKEN, '123')
        navigate(appRoutePaths.vendorList)
      }
    } catch (err) {
      //TODO: Написать логику ошибки авторизации https://jira.x.sberauto.com/browse/DCB-2
    }

    setIsFetch(false)
  }, [navigate])

  return { onGoToSberAuth, isFetch }
}
