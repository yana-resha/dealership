import { SESSION_STORAGE_TAB_ID } from 'entities/tabManagement/constants'
import * as tabsSlice from 'entities/tabManagement/model/tabsSlice'

import * as tabManagementHook from '../useTabManagement'

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
}))

describe('messageHandlerFabric', () => {
  const mockDispatch = jest.fn()
  const mockChannel = {
    postMessage: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()

    Object.defineProperty(window, 'sessionStorage', {
      value: {
        setItem: jest.fn(),
      },
      writable: true,
    })
  })

  it('отвечает на сообщение с типом "tab/is_id_occupied?"', () => {
    const tabId = 123
    const messageHandler = tabManagementHook.messageHandlerFabric(mockChannel as any, tabId, mockDispatch)

    messageHandler({
      data: {
        type: 'tab/is_id_occupied?',
        tabId,
      } as tabManagementHook.Message,
    } as any)

    expect(mockChannel.postMessage).toHaveBeenCalledWith({
      type: 'tab/id_is_occupied',
      tabId,
    })
  })

  it('обрабатывает сообщение с типом "tab/id_is_occupied"', () => {
    const tabId = 123
    const nextTabId = 456
    Date.now = jest.fn(() => nextTabId)
    const addTabMock = jest.spyOn(tabsSlice, 'addTab')
    const messageHandler = tabManagementHook.messageHandlerFabric(mockChannel as any, tabId, mockDispatch)

    messageHandler({
      data: {
        type: 'tab/id_is_occupied',
        tabId,
      } as tabManagementHook.Message,
    } as any)

    expect(sessionStorage.setItem).toHaveBeenCalledWith(SESSION_STORAGE_TAB_ID, `${nextTabId}`)
    expect(addTabMock).toHaveBeenCalledWith(tabId)
    expect(mockChannel.postMessage).toHaveBeenCalledWith({
      type: 'tab/is_id_occupied?',
      tabId: nextTabId,
    })
  })
})
