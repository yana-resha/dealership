import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TabsState {
  openTabs: number[]
}

const initialState: TabsState = {
  openTabs: [],
}

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<number>) => {
      state.openTabs.push(action.payload)
    },
    removeTab: (state, action: PayloadAction<number>) => {
      state.openTabs = state.openTabs.filter(tabId => tabId !== action.payload)
    },
  },
})

export const { addTab, removeTab } = tabsSlice.actions
export default tabsSlice
