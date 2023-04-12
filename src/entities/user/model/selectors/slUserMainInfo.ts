import { maskPhoneNumber } from 'shared/masks/InputMasks'

export const slUserMainInfo = (state: RootState) => {
  const phoneNumber = state.user?.user?.phone ? maskPhoneNumber(state.user?.user?.phone) : ''
  const name = `${state.user?.user?.firstName ?? ''} ${state.user?.user?.firstName ?? ''}`.trim()

  return {
    phoneNumber,
    name,
  }
}
