import { useAppSelector } from 'shared/hooks/store/useAppSelector'

import { Role } from '../types'

export const useUserRoles = () => {
  const roles = useAppSelector(state => state.user.user?.roles)
  const isCreditExpert = roles?.[Role.FrontdcCreditExpert] ?? false
  const isContentManager = roles?.[Role.FrontdcContentManager] ?? false

  return { isCreditExpert, isContentManager }
}
