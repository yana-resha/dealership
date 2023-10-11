import React from 'react'

import { ReactComponent as LogoutIcon } from 'assets/icons/logout.svg'
import { useLogout, AuthType } from 'common/auth'
import { appRoutePaths } from 'shared/navigation/routerPath'

import { MenuItem } from './types'

type UseGetLogoutBtnProps = {
  authType: AuthType
}

export const useGetLogoutBtn = (props: UseGetLogoutBtnProps): MenuItem | null => {
  const { authType } = props

  const { logout } = useLogout()

  if (authType != 'no_auth') {
    return {
      label: 'Выйти',
      icon: () => <LogoutIcon />,
      path: appRoutePaths.auth,
      onCallback: logout,
    }
  }

  return null
}
