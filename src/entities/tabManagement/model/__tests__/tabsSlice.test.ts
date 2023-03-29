import { configureStore } from '@reduxjs/toolkit'

import tabsSlice, { addTab, removeTab } from '../tabsSlice'

const { reducer } = tabsSlice

const createStore = () =>
  configureStore({
    reducer: {
      tabs: reducer,
    },
  })

describe('tabsSlice', () => {
  it('должен добавить вкладку', () => {
    const store = createStore()
    const tabId = 1

    store.dispatch(addTab(tabId))

    const { openTabs } = store.getState().tabs
    expect(openTabs).toContain(tabId)
  })

  it('должен удалить вкладку', () => {
    const store = createStore()
    const tabId = 1

    // Добавьте таб перед его удалением
    store.dispatch(addTab(tabId))
    store.dispatch(removeTab(tabId))

    const { openTabs } = store.getState().tabs
    expect(openTabs).not.toContain(tabId)
  })
})
