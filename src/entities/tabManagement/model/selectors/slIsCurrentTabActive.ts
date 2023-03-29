import { SESSION_STORAGE_TAB_ID } from 'entities/tabManagement/constants'

export const slIsCurrentTabActive = (state: RootState) => {
  const currentTabId = sessionStorage.getItem(SESSION_STORAGE_TAB_ID)
  const currentTabIdNum = currentTabId ? parseInt(currentTabId, 10) : undefined

  const firstTab = state.tabs.openTabs.slice().sort()[0]

  return !currentTabIdNum || !state.tabs.openTabs.length || firstTab === currentTabIdNum
}
