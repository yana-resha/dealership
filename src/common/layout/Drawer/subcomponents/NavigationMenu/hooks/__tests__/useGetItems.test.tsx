import { renderHook } from '@testing-library/react-hooks'

import { ThemeProviderMock } from 'tests/mocks'

import { useGetItems } from '../useGetItems'

describe('useGetItems', () => {
  it('возвращает пустой массив для неавторизованных пользователей', () => {
    const { result } = renderHook(() => useGetItems({ authType: 'no_auth' }), { wrapper: ThemeProviderMock })

    expect(result.current).toEqual([])
  })

  it('возвращает массив элементов меню для авторизованных пользователей', () => {
    const { result } = renderHook(() => useGetItems({ authType: 'auth' }), { wrapper: ThemeProviderMock })
    const expectedMenuItems = [
      {
        label: 'Создать заявку',
        icon: expect.any(Function),
        path: '/create_order',
      },
      {
        label: 'Текущие заявки',
        icon: expect.any(Function),
        path: '/order_list',
      },
      {
        label: 'Документы',
        icon: expect.any(Function),
        path: '/document_storage',
      },
    ]

    expect(result.current).toMatchObject(expectedMenuItems)
  })
})
