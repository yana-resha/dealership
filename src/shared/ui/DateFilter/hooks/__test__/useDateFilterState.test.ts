import { renderHook, act } from '@testing-library/react'
import { DateTime } from 'luxon'

import * as useAppSelectorModule from 'shared/hooks/store/useAppSelector'

import { SelectionType } from '../../DateFilter.types'
import { useDateFilterState } from '../useDateFilterState'

const mockedUseAppSelector = jest.spyOn(useAppSelectorModule, 'useAppSelector')
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}))

const setFrom = (day: string) => {
  const { result } = renderHook(() => useDateFilterState(true))
  act(() => result.current.handleChangeType())
  act(() => result.current.handleCellClick(day))

  return result
}

const setTo = (from: string, to: string) => {
  const result = setFrom(from)
  act(() => result.current.handleCellClick(to))

  return result
}

describe('useDateFilterState', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date(2024, 8, 1))
    mockedUseAppSelector.mockImplementation(() => ({ filter: {} }))
  })
  afterAll(() => {
    jest.useRealTimers()
  })
  describe('onBackClicked', () => {
    it('Если вызван onBackClicked, уменьшаем отображаемый месяц на 1', () => {
      const { result } = renderHook(() => useDateFilterState(true))
      act(() => result.current.handleBackBtnClick())
      expect(result.current.viewDate.getMonth()).toEqual(7)
    })
  })
  describe('onForwardClicked', () => {
    it('Если вызван onForwardClicked, увеличиваем отображаемый месяц на 1', () => {
      const { result } = renderHook(() => useDateFilterState(true))
      act(() => result.current.handleForwardBtnClick())
      expect(result.current.viewDate.getMonth()).toEqual(9)
    })
  })

  describe('handleChangeType', () => {
    it('Если вызван handleChangeType, меняем тип', () => {
      const { result } = renderHook(() => useDateFilterState(true))
      act(() => result.current.handleChangeType())
      expect(result.current.isPeriodTypeSelected).toBeTruthy()
      act(() => result.current.handleChangeType())
      expect(result.current.isPeriodTypeSelected).toBeFalsy()
    })
  })

  describe('setMonth', () => {
    it('Если вызван setMonth, устанавливается корректный месяц', () => {
      const date = new Date()
      date.setMonth(3)
      const { result } = renderHook(() => useDateFilterState(true))
      act(() => result.current.setMonth(DateTime.fromJSDate(date)))
      expect(result.current.viewDate.getMonth()).toEqual(3)
    })
  })

  describe('setYear', () => {
    it('Если вызван setYear, устанавливается корректный год', () => {
      const date = new Date()
      date.setFullYear(1991)
      const { result } = renderHook(() => useDateFilterState(true))
      act(() => result.current.setYear(DateTime.fromJSDate(date)))
      expect(result.current.viewDate.getFullYear()).toEqual(1991)
    })
  })

  describe('handleCellClicked', () => {
    it('Если тип false(day), день выбирается', () => {
      const { result } = renderHook(() => useDateFilterState(true))
      act(() => result.current.handleCellClick('1'))
      expect(result.current.filter).toEqual({
        isPeriodTypeSelected: false,
        day: new Date(2024, 8, 1),
      })
      expect(result.current.rows[0][6]).toEqual({ label: '1', selectionType: SelectionType.SELECTED })
    })

    it('Если тип true(period) и период не выбирался, выбран from', () => {
      const result = setFrom('1')
      expect(result.current.filter).toEqual({
        isPeriodTypeSelected: true,
        period: {
          from: new Date(2024, 8, 1),
        },
      })
      expect(result.current.rows[0][6]).toEqual({ label: '1', selectionType: SelectionType.FIRST })
    })

    it('Если тип true(period) и from выбран и кликнули на тотже день, очистить фильтр', () => {
      const result = setFrom('1')
      act(() => result.current.handleCellClick('1'))
      expect(result.current.filter).toEqual({
        isPeriodTypeSelected: true,
        period: undefined,
      })
      expect(result.current.rows[0][6]).toEqual({ label: '1', selectionType: undefined })
    })

    it('Если тип true(period) и from выбран и кликнули на день < from, переместить from', () => {
      const result = setFrom('5')
      act(() => result.current.handleCellClick('1'))
      expect(result.current.filter).toEqual({
        isPeriodTypeSelected: true,
        period: {
          from: new Date(2024, 8, 1),
        },
      })
      expect(result.current.rows[0][6]).toEqual({ label: '1', selectionType: SelectionType.FIRST })
    })

    it('Если тип true(period) и from выбран, установить to', () => {
      const result = setTo('1', '3')
      expect(result.current.filter).toEqual({
        isPeriodTypeSelected: true,
        period: {
          from: new Date(2024, 8, 1),
          to: new Date(2024, 8, 3),
        },
      })
      expect(result.current.rows[0][6]).toEqual({ label: '1', selectionType: SelectionType.FIRST })
      expect(result.current.rows[1][0]).toEqual({ label: '2', selectionType: SelectionType.MIDDLE })
      expect(result.current.rows[1][1]).toEqual({ label: '3', selectionType: SelectionType.LAST })
    })

    it(
      'Если тип true(period) и period выбран и кликнули на дату = to,' + 'приравнять from к to и обнулить to',
      () => {
        const result = setTo('1', '3')
        act(() => result.current.handleCellClick('3'))
        expect(result.current.filter).toEqual({
          isPeriodTypeSelected: true,
          period: {
            from: new Date(2024, 8, 3),
          },
        })
        expect(result.current.rows[1][1]).toEqual({ label: '3', selectionType: SelectionType.FIRST })
      },
    )

    it(
      'Если тип true(period) и period выбран и кликнули на дату вне периода,' +
        'приравнять from к дате, и обнулить to',
      () => {
        const result = setTo('1', '3')
        act(() => result.current.handleCellClick('4'))
        expect(result.current.filter).toEqual({
          isPeriodTypeSelected: true,
          period: {
            from: new Date(2024, 8, 4),
          },
        })
        expect(result.current.rows[1][2]).toEqual({ label: '4', selectionType: SelectionType.FIRST })
      },
    )

    it(
      'Если тип true(period) и period выбран и кликнули на дату внутри периода,' +
        'и from ближе к дате, приравнять from к дате',
      () => {
        const result = setTo('1', '4')
        act(() => result.current.handleCellClick('2'))
        expect(result.current.filter).toEqual({
          isPeriodTypeSelected: true,
          period: {
            from: new Date(2024, 8, 2),
            to: new Date(2024, 8, 4),
          },
        })
        expect(result.current.rows[1][0]).toEqual({ label: '2', selectionType: SelectionType.FIRST })
        expect(result.current.rows[1][1]).toEqual({ label: '3', selectionType: SelectionType.MIDDLE })
        expect(result.current.rows[1][2]).toEqual({ label: '4', selectionType: SelectionType.LAST })
      },
    )

    it(
      'Если тип true(period) и period выбран и кликнули на дату внутри периода,' +
        'и to ближе к дате, приравнять to к дате',
      () => {
        const result = setTo('1', '4')
        act(() => result.current.handleCellClick('3'))
        expect(result.current.filter).toEqual({
          isPeriodTypeSelected: true,
          period: {
            from: new Date(2024, 8, 1),
            to: new Date(2024, 8, 3),
          },
        })
        expect(result.current.rows[0][6]).toEqual({ label: '1', selectionType: SelectionType.FIRST })
        expect(result.current.rows[1][0]).toEqual({ label: '2', selectionType: SelectionType.MIDDLE })
        expect(result.current.rows[1][1]).toEqual({ label: '3', selectionType: SelectionType.LAST })
      },
    )
  })
})
