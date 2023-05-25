import { act, renderHook } from '@testing-library/react'

import { ChangingIdsOption } from 'common/OrderCalculator/constants'
import { disableConsole } from 'tests/utils'

import { useAdditionalServiceIds } from '../useAdditionalServiceIds'

disableConsole('error')

describe('useAdditionalServiceIds', () => {
  it('Работает добавление элементов в массив, удаление, очистка', () => {
    const { result } = renderHook(() => useAdditionalServiceIds())
    // Проверка добавления элементов
    act(() => {
      result.current.changeIds(0, ChangingIdsOption.add)
    })

    expect(result.current.ids).toHaveLength(2)

    const ids = [...result.current.ids]

    act(() => {
      result.current.changeIds(0, ChangingIdsOption.add)
    })

    expect(result.current.ids).toHaveLength(3)
    expect(result.current.ids[0]).toBe(ids[0])
    expect(result.current.ids[2]).toBe(ids[1])

    // Проверка удаления элементов
    ids.length = 0
    ids.push(...result.current.ids)

    act(() => {
      result.current.changeIds(1, ChangingIdsOption.remove)
    })
    expect(result.current.ids).toHaveLength(2)
    expect(result.current.ids[0]).toBe(ids[0])
    expect(result.current.ids[1]).toBe(ids[2])

    // Проверка очистки элементов
    act(() => {
      result.current.changeIds(1, ChangingIdsOption.add)
    })

    ids.length = 0
    ids.push(...result.current.ids)

    act(() => {
      result.current.changeIds(1, ChangingIdsOption.clear, 2)
    })

    expect(result.current.ids).toHaveLength(2)
    expect(ids.includes(result.current.ids[0])).toBe(false)
    expect(ids.includes(result.current.ids[1])).toBe(false)
  })
})
