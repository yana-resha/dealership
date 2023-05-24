import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Order = {
  passportSeries?: string
  passportNumber?: string
  lastName?: string
  firstName?: string
  middleName?: string
  birthDate?: string
  phoneNumber?: string
}

interface OrderState {
  order?: Order
}

const initialState: OrderState = {}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<Order>) => {
      state.order = { ...action.payload }
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      state.order = { ...(state.order || {}), ...action.payload }
    },
    clearOrder: state => {
      state.order = undefined
    },
  },
})

export const { updateOrder, setOrder, clearOrder } = orderSlice.actions
export default orderSlice
