import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ApplicationFrontdc, GetFullApplicationResponse } from '@sberauto/loanapplifecycledc-proto/public'
import merge from 'lodash/merge'

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
    updateApplication: (state, action: PayloadAction<ApplicationFrontdc>) => {
      state.order = {
        ...(state.order || {}),
        orderData: {
          ...state.order?.orderData,
          application: {
            ...state.order?.orderData?.application,
            ...action.payload,
          },
        },
      }
    },
    clearOrder: state => {
      state.order = undefined
    },
    setAppId: (state, action: PayloadAction<{ dcAppId: string }>) => {
      const currentOrder: Order = state.order ?? {}
      const orderWithAppId: Order = {
        orderData: { application: { dcAppId: action.payload.dcAppId } },
      }

      state.order = merge(currentOrder, orderWithAppId)
    },
  },
})

export const { updateOrder, setOrder, clearOrder, setAppId, updateApplication } = orderSlice.actions
export default orderSlice
