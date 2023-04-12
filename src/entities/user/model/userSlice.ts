import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GetUserResponse } from '@sberauto/authdc-proto/public'

interface UserState {
  user?: GetUserResponse
}

const initialState: UserState = {}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<GetUserResponse>) => {
      state.user = action.payload
    },
    removeUserInfo: state => {
      state.user = undefined
    },
  },
})

export const { setUserInfo, removeUserInfo } = userSlice.actions
export default userSlice
