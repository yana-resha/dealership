import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CreditProduct, ProductCondition, RateMod } from '@sberauto/dictionarydc-proto/public'
import { ApplicationFrontdc, GetFullApplicationResponse } from '@sberauto/loanapplifecycledc-proto/public'
import merge from 'lodash/merge'

interface FillingProgress {
  isFilledElementaryClientData?: boolean
  isFilledLoanData?: boolean
}

export type RequiredProduct = Omit<CreditProduct, 'productId' | 'productName' | 'conditions'> &
  Required<Pick<CreditProduct, 'productId' | 'productName'>> & {
    conditions: RequiredProductCondition[]
  }

export type RequiredProductCondition = Omit<ProductCondition, 'rateMods'> & { rateMods: RequiredRateMods[] }

export type RequiredRateMods = Omit<RateMod, 'optionId' | 'tariffId' | 'requiredService'> &
  Required<Pick<RateMod, 'optionId' | 'tariffId' | 'requiredService'>>

export type ProductsMap = Record<string, RequiredProduct>

export type Order = {
  currentStep?: number
  fillingProgress?: FillingProgress
  passportSeries?: string
  passportNumber?: string
  lastName?: string
  firstName?: string
  middleName?: string
  birthDate?: string
  phoneNumber?: string
  productsMap?: ProductsMap
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
    updateFillingProgress: (state, action: PayloadAction<FillingProgress>) => {
      state.order = {
        ...(state.order || {}),
        fillingProgress: {
          ...state.order?.fillingProgress,
          ...action.payload,
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
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.order = {
        ...(state.order || {}),
        currentStep: action.payload,
      }
    },
  },
})

export const {
  updateOrder,
  setOrder,
  clearOrder,
  setAppId,
  updateApplication,
  updateFillingProgress,
  setCurrentStep,
} = orderSlice.actions
export default orderSlice
