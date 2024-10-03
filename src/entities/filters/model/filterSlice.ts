import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { DateFilterState } from 'shared/ui/DateFilter'

export type Filter = {
  date?: DateFilterState
  statuses: string[]
}

const initialState: Filter = {
  statuses: [],
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setDate: (state, action: PayloadAction<DateFilterState>) => {
      state.date = { ...action.payload }
    },
    setStatuses: (state, action: PayloadAction<string[]>) => {
      state.statuses = [...action.payload]
    },
  },
})

export const { setDate, setStatuses } = filterSlice.actions
export { filterSlice }
