import { AnyAction, combineReducers, configureStore, Dispatch, Middleware } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { persistReducer, persistStore, WebStorage } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import storageSession from 'redux-persist/lib/storage/session'
import { initMessageListener } from 'redux-state-sync'

import { orderSlice } from 'entities/order'
import { userSlice } from 'entities/user'

const persistDefaultConfig = (key: string, storage: WebStorage) => ({
  key,
  storage,
})

const rootReducer = combineReducers({
  [userSlice.name]: persistReducer(persistDefaultConfig(userSlice.name, storage), userSlice.reducer),
  [orderSlice.name]: persistReducer(
    persistDefaultConfig(orderSlice.name, storageSession),
    orderSlice.reducer,
  ),
})

const middlewares: Middleware<{}, any, Dispatch<AnyAction>>[] = []

if (process.env.NODE_ENV === 'development') {
  const logger = require('redux-logger').default

  const enableReduxLogger = false
  if (enableReduxLogger) {
    middlewares.push(logger)
  }
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(...middlewares),
})

initMessageListener(store)
setupListeners(store.dispatch)
persistStore(store)

declare global {
  type RootState = ReturnType<typeof store.getState>
  type AppDispatch = typeof store.dispatch
}
