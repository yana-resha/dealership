import { createSelector } from '@reduxjs/toolkit'

import { maskMobilePhoneNumber } from 'shared/masks/InputMasks'

export const slUserMainInfo = createSelector(
  (state: RootState) => state.user,
  user => {
    const phoneNumber = user?.user?.phone ? maskMobilePhoneNumber(user?.user?.phone) : ''
    const name = `${user?.user?.firstName ?? ''} ${user?.user?.lastName ?? ''}`.trim()

    return {
      phoneNumber,
      name,
    }
  },
)
