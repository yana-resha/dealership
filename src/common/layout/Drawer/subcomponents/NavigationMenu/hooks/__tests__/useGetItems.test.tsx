import { renderHook } from '@testing-library/react-hooks'

import * as useUserRolesModule from 'entities/user/hooks/useUserRoles'
import { MockProviders } from 'tests/mocks'

import { useGetItems } from '../useGetItems'

const mockedUseUserRoles = jest.spyOn(useUserRolesModule, 'useUserRoles')

describe('useGetItems', () => {
  it('Возвращает соответствующий массив элементов меню для пользователей с ролью "Кредитный эксперт"', () => {
    mockedUseUserRoles.mockImplementation(() => ({ isContentManager: false, isCreditExpert: true }))
    const { result } = renderHook(() => useGetItems(), { wrapper: MockProviders })
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
        label: 'Калькулятор',
        icon: expect.any(Function),
        path: '/calculator',
      },
      {
        label: 'Документы',
        icon: expect.any(Function),
        path: '/document_storage',
      },
      {
        label: 'Поддержка',
        icon: expect.any(Function),
        path: '/helpdesk',
      },
    ]
    expect(result.current).toMatchObject(expectedMenuItems)
  })

  it('Возвращает соответствующий массив элементов меню для пользователей с ролью "Контент менеджер"', () => {
    mockedUseUserRoles.mockImplementation(() => ({ isContentManager: true, isCreditExpert: false }))
    const { result } = renderHook(() => useGetItems(), { wrapper: MockProviders })
    const expectedMenuItems = [
      {
        label: 'Документы',
        icon: expect.any(Function),
        path: '/document_storage',
      },
      {
        label: 'Поддержка',
        icon: expect.any(Function),
        path: '/helpdesk',
      },
    ]
    expect(result.current).toMatchObject(expectedMenuItems)
  })
})
