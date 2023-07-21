import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GetFullApplicationResponse } from '@sberauto/loanapplifecycledc-proto/public'

import { RequiredProduct } from '../../common/OrderCalculator/utils/prepareCreditProductListData'

export type Order = {
  currentStep?: number
  passportSeries?: string
  passportNumber?: string
  lastName?: string
  firstName?: string
  middleName?: string
  birthDate?: string
  phoneNumber?: string
  creditProductsList?: RequiredProduct[]
  orderData?: GetFullApplicationResponse | null | undefined
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
