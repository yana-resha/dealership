import { useEffect } from 'react'

import { Dispatch } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import { stringToNumber } from 'shared/utils/stringToNumber'

import { SESSION_STORAGE_TAB_ID } from '../constants'
import { addTab, removeTab } from '../model/tabsSlice'
// Экспортируем этот же модуль чтобы можно было в тестах мокать
// https://stackoverflow.com/questions/45111198/how-to-mock-functions-in-the-same-module-using-jest
import * as tabManagementHook from './useTabManagement'

export type Message = {
  type: 'tab/is_id_occupied?' | 'tab/id_is_occupied'
  tabId: number
}

/** Обрабатываем входящие сообщения */
export const messageHandlerFabric =
  (channel: BroadcastChannel, currentTabId: number, dispatch: Dispatch) => (event: MessageEvent<Message>) => {
    // Получили вопрос от другой вкладки "Занят ли уже этот id?"
    if (event.data.type === 'tab/is_id_occupied?') {
      if (event.data.tabId === currentTabId) {
        channel.postMessage({ type: 'tab/id_is_occupied', tabId: currentTabId })
      }
    }
    // Получили сообщение от другой вкладки, что наш tabId уже занят и нужно его заменить
    if (event.data.type === 'tab/id_is_occupied') {
      if (event.data.tabId === currentTabId) {
        const newTabId = Date.now()
        sessionStorage.setItem(SESSION_STORAGE_TAB_ID, `${newTabId}`)
        dispatch(addTab(currentTabId))
        channel.postMessage({ type: 'tab/is_id_occupied?', tabId: newTabId })
      }
    }
  }

export const manageTabChannel = (tabId: number, dispatch: Dispatch) => {
  /** Создаем BroadcastChannel для связи между вкладками
   * Нужно добавлять общение между вкладками, потому что в sessionStoradge
   * может копироваться между вкладками https://medium.com/swlh/a-less-known-thing-about-session-storage-api-4e59f6218af9
   */
  const channel = new BroadcastChannel('uniqueTabChannel')

  // Отправляем tabId другим вкладкам
  channel.postMessage({ type: 'tab/is_id_occupied?', tabId })

  // Прослушиваем сообщения от других вкладок
  const messageHandler = tabManagementHook.messageHandlerFabric(channel, tabId, dispatch)
  channel.addEventListener('message', messageHandler)

  // Удаляем tabId при закрытии вкладки
  const beforeunloadHandler = () => {
    dispatch(removeTab(tabId))
    channel.close()
  }
  window.addEventListener('beforeunload', beforeunloadHandler)

  return () => {
    channel.removeEventListener('message', messageHandler)
    window.removeEventListener('beforeunload', beforeunloadHandler)
  }
}

export const useTabManagement = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const saveStrTabId = sessionStorage.getItem(SESSION_STORAGE_TAB_ID)
    const saveTabId = stringToNumber(saveStrTabId || undefined)
    const tabId = saveTabId || Date.now()

    if (!saveTabId) {
      sessionStorage.setItem(SESSION_STORAGE_TAB_ID, `${tabId}`)
    }
    dispatch(addTab(tabId))

    const cleanupChannel = tabManagementHook.manageTabChannel(tabId, dispatch)

    return cleanupChannel
  }, [dispatch])
}
