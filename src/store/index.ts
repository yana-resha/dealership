import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'

import { pointsOfSaleApi } from 'shared/api/pointsOfSale.api'

export const store = configureStore({
  reducer: {
    [pointsOfSaleApi.reducerPath]: pointsOfSaleApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(pointsOfSaleApi.middleware),
})

setupListeners(store.dispatch)

declare global {
  type RootState = ReturnType<typeof store.getState>
  type AppDispatch = typeof store.dispatch
}
