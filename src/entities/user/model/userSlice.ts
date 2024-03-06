import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { PreparedUser } from '../types'

interface UserState {
  user?: PreparedUser
}

const initialState: UserState = {}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<PreparedUser>) => {
      state.user = action.payload
    },
    removeUserInfo: state => {
      state.user = undefined
    },
  },
})

export const { setUserInfo, removeUserInfo } = userSlice.actions
export default userSlice
