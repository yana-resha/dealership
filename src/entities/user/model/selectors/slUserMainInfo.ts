import { createSelector } from '@reduxjs/toolkit'

import { maskPhoneNumber } from 'shared/masks/InputMasks'

export const slUserMainInfo = createSelector(
  (state: RootState) => state.user,
  user => {
    const phoneNumber = user?.user?.phone ? maskPhoneNumber(user?.user?.phone) : ''
    const name = `${user?.user?.firstName ?? ''} ${user?.user?.lastName ?? ''}`.trim()

    return {
      phoneNumber,
      name,
    }
  },
)
