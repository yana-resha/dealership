import { fireEvent } from '@testing-library/react'

import * as tabsSlice from 'entities/tabManagement/model/tabsSlice'

import * as tabManagementHook from '../useTabManagement'

const { manageTabChannel } = tabManagementHook

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
}))

describe('manageTabChannel', () => {
  const mockDispatch = jest.fn()

  // Мокаем BroadcastChannel
  const mockPostMessage = jest.fn()
  const mockAddEventListener = jest.fn()
  const mockRemoveEventListener = jest.fn()
  const mockClose = jest.fn()
  const mockCheckChannelName = jest.fn()

  const channel = {
    postMessage: mockPostMessage,
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
    close: mockClose,
  } as unknown as BroadcastChannel

  function mockChannel(name: string) {
    mockCheckChannelName(name)

    return channel
  }

  beforeEach(() => {
    jest.clearAllMocks()

    Object.defineProperty(global, 'BroadcastChannel', {
      value: mockChannel,
    })
  })

  it('должен создавать BroadcastChannel и отправлять сообщения', () => {
    const tabId = 123

    const cleanup = manageTabChannel(tabId, mockDispatch)

    expect(mockCheckChannelName).toBeCalledWith('uniqueTabChannel')
    expect(mockPostMessage).toBeCalledWith({ type: 'tab/is_id_occupied?', tabId: tabId })

    cleanup()
  })

  it('должен создавать обработчик сообщений и вызывать messageHandlerFabric', () => {
    const tabId = 123

    const messageHandler = jest.fn()
    const messageHandlerFabricMock = jest.spyOn(tabManagementHook, 'messageHandlerFabric')
    messageHandlerFabricMock.mockReturnValue(messageHandler)

    manageTabChannel(tabId, mockDispatch)
    expect(mockAddEventListener).toBeCalledWith('message', messageHandler)

    messageHandler({ data: { type: 'tab/is_id_occupied?', tabId: tabId } })
    expect(messageHandlerFabricMock).toHaveBeenCalledWith(channel, tabId, mockDispatch)
  })

  it('при закрытии вкладки, вызывается событие удаление таба из списка активных табов', () => {
    const tabId = 123

    const removeTabMock = jest.spyOn(tabsSlice, 'removeTab')

    manageTabChannel(tabId, mockDispatch)
    fireEvent(window, new MessageEvent('beforeunload'))

    expect(removeTabMock).toHaveBeenCalledWith(tabId)
  })
})
