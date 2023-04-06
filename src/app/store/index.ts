import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync'

import { appLifeCycleApi } from 'common/findApplication/FindApplication/FindApplication.api'
import { tabsSlice } from 'entities/tabManagement'
import { userSlice } from 'entities/user'
import { pointsOfSaleApi } from 'shared/api/pointsOfSale.api'

// Настройки для сохранения редьюсера в локалСторадж
const persistTabsConfig = {
  key: tabsSlice.name,
  storage,
  whitelist: ['openTabs'],
}

const persistDefaultConfig = (key: string) => ({
  key,
  storage,
})

const rootReducer = combineReducers({
  [tabsSlice.name]: persistReducer(persistTabsConfig, tabsSlice.reducer),
  [pointsOfSaleApi.reducerPath]: pointsOfSaleApi.reducer,
  [appLifeCycleApi.reducerPath]: appLifeCycleApi.reducer,
  [userSlice.name]: persistReducer(persistDefaultConfig(userSlice.name), userSlice.reducer),
})

// Помогает синхронизировать состояние между вкладками, на пример для блока дублирующей вкладки
const syncStateMiddleware = createStateSyncMiddleware({
  whitelist: Object.keys(tabsSlice.actions).map(action => `${tabsSlice.name}/${action}`),
})

const middlewares = [pointsOfSaleApi.middleware, syncStateMiddleware, appLifeCycleApi.middleware]

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
