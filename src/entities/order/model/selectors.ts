import { createSelector } from '@reduxjs/toolkit'

const selectState = (state: RootState) => state

export const selectApplication = createSelector(
  selectState,
  state => state.order.order?.orderData?.application || {},
)

export const selectCurrentGovernmentProgram = createSelector(selectState, state => {
  const governmentProgramCode = state.order.order?.orderData?.application?.loanData?.govprogramCode
  const governmentProgram = state.order.order?.governmentProgramsMap?.[governmentProgramCode || '']

  return governmentProgram
})

export const selectApplicationScans = createSelector(
  selectState,
  state => state.order.order?.orderData?.application?.scans || [],
)
