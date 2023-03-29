import { renderHook } from '@testing-library/react-hooks'

import { SESSION_STORAGE_TAB_ID } from 'entities/tabManagement/constants'
import * as tabsSlice from 'entities/tabManagement/model/tabsSlice'

import * as tabManagementHook from '../useTabManagement'

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
}))

describe('useTabManagement', () => {
  const cleanupChannel = jest.fn()

  const addTabMock = jest.spyOn(tabsSlice, 'addTab')
  const manageTabChannelMock = jest.spyOn(tabManagementHook, 'manageTabChannel').mockImplementation(jest.fn())

  beforeEach(() => {
    sessionStorage.clear()
    manageTabChannelMock.mockImplementation((...arg: any[]) => cleanupChannel)
  })

  it('должен устанавливать tabId из sessionStorage, если он существует', () => {
    const savedTabId = '1234567890'
    sessionStorage.setItem(SESSION_STORAGE_TAB_ID, savedTabId)
    renderHook(() => tabManagementHook.useTabManagement())

    expect(addTabMock).toHaveBeenCalledWith(parseInt(savedTabId, 10))
  })

  it('должен генерировать и сохранять новый tabId в sessionStorage, если его нет', () => {
    renderHook(() => tabManagementHook.useTabManagement())

    const storedTabId = sessionStorage.getItem(SESSION_STORAGE_TAB_ID)
    expect(storedTabId).not.toBeNull()
    expect(addTabMock).toHaveBeenCalledWith(parseInt(storedTabId ?? '-1', 10))
  })

  it('должен вызывать manageTabChannel с корректными параметрами', () => {
    const tabId = 123
    sessionStorage.setItem(SESSION_STORAGE_TAB_ID, `${tabId}`)

    renderHook(() => tabManagementHook.useTabManagement())

    expect(manageTabChannelMock.mock.calls[0][0]).toBe(tabId)
  })

  it('должен выполнять cleanupChannel при размонтировании', () => {
    const { unmount } = renderHook(() => tabManagementHook.useTabManagement())

    unmount()

    expect(cleanupChannel).toHaveBeenCalled()
  })
})
