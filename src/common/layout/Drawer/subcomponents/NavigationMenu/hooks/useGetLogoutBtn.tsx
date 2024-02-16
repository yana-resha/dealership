import { ReactComponent as LogoutIcon } from 'assets/icons/logout.svg'
import { useLogout } from 'common/auth'
import { appRoutePaths } from 'shared/navigation/routerPath'

import { MenuItem } from './types'

export const useGetLogoutBtn = (): MenuItem | null => {
  const { logout } = useLogout()

  return {
    label: 'Выйти',
    icon: () => <LogoutIcon />,
    path: appRoutePaths.auth,
    onCallback: logout,
  }
}
