import { configureStore } from '@reduxjs/toolkit'

import { SESSION_STORAGE_TAB_ID } from 'entities/tabManagement/constants'

import tabsSlice, { addTab } from '../../tabsSlice'
import { slIsCurrentTabActive } from '../slIsCurrentTabActive'

const { reducer } = tabsSlice

const createStore = () =>
  configureStore({
    reducer: {
      tabs: reducer,
    },
  })

describe('selectors', () => {
  afterEach(() => {
    sessionStorage.removeItem(SESSION_STORAGE_TAB_ID)
  })

  it('должен вернуть true, если текущая вкладка является активной', () => {
    const store = createStore()
    const tabId = 1

    store.dispatch(addTab(tabId))
    sessionStorage.setItem(SESSION_STORAGE_TAB_ID, String(tabId))

    expect(slIsCurrentTabActive(store.getState() as RootState)).toBeTruthy()
  })

  it('должен вернуть true, если текущая вкладка не определена и открытых вкладок нет', () => {
    const store = createStore()

    expect(slIsCurrentTabActive(store.getState() as RootState)).toBeTruthy()
  })

  it('должен вернуть false, если текущая вкладка не является активной', () => {
    const store = createStore()
    const tabId1 = 1
    const tabId2 = 2

    store.dispatch(addTab(tabId1))
    store.dispatch(addTab(tabId2))
    sessionStorage.setItem(SESSION_STORAGE_TAB_ID, String(tabId2))

    expect(slIsCurrentTabActive(store.getState() as RootState)).toBeFalsy()
  })
})
