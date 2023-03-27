import React from 'react'

import { ReactComponent as LogoutIcon } from 'assets/icons/logout.svg'
import { AuthType } from 'common/auth/CheckToken'
import { useLogout } from 'common/auth/Logout'

import { MenuItem } from './types'

type UseGetLogoutBtnProps = {
  authType: AuthType
}

export const useGetLogoutBtn = (props: UseGetLogoutBtnProps): MenuItem | null => {
  const { authType } = props

  const { onLogout } = useLogout()

  if (authType != 'no_auth') {
    return {
      label: 'Выйти',
      icon: () => <LogoutIcon />,
      path: '/auth',
      onCallback: onLogout,
    }
  }

  return null
}
