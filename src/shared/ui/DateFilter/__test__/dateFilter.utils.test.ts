import { SelectionType } from '../DateFilter.types'
import {
  dateDiffInDays,
  daysInMonth,
  isDateBetween,
  isSameDatesIgnoreTime,
  firstRowAddEmptySpaces,
  lastRowAddEmptySpaces,
  compareDatesForSelection,
  getDaySelection,
  getMiddleDaySelection,
  getRangeSelection,
  getSelection,
  getRows,
} from '../dateFilter.utils'

describe('dateFilterUtils', () => {
  describe('daysInMonth', () => {
    it('Корректно возвращает количество дней в месяце', () => {
      expect(daysInMonth(new Date(2024, 8, 1))).toEqual(30)
    })
  })

  describe('isSameDatesIgnoreTime', () => {
    it('Если день один и тот же, Вернет true проигнорировав время', () => {
      const d1 = new Date(2024, 9, 1, 6)
      const d2 = new Date(2024, 9, 1, 5)
      expect(isSameDatesIgnoreTime(d1, d2)).toBeTruthy()
    })
    it('Если дни разные, вернет false', () => {
      const d1 = new Date(2024, 9, 1, 6)
      const d2 = new Date(2024, 9, 2, 5)
      expect(isSameDatesIgnoreTime(d1, d2)).toBeFalsy()
    })
  })

  describe('isDateBetween', () => {
    it('Если дата между, Вернет true проигнорировав время', () => {
      const from = new Date(2024, 9, 1)
      const to = new Date(2024, 9, 10)
      const check = new Date(2024, 9, 5)
      expect(isDateBetween(from, to, check)).toBeTruthy()
    })
    it('Если дата не входит в отрезок, вернет false', () => {
      const from = new Date(2024, 9, 1)
      const to = new Date(2024, 9, 10)
      const check = new Date(2024, 9, 11)
      expect(isDateBetween(from, to, check)).toBeFalsy()
    })
  })

  describe('dateDiffInDays', () => {
    it('Корректно расчитывает количество дней между двумя датами', () => {
      const from = new Date(2024, 9, 1)
      const to = new Date(2024, 9, 10)
      expect(dateDiffInDays(from, to)).toEqual(9)
      expect(dateDiffInDays(to, from)).toEqual(9)
    })
  })

  describe('firstRowAddEmptySpaces', () => {
    it('Если первое число приходится на понедельник, вернет пустой список', () => {
      const date = new Date(2024, 6, 1)
      expect(firstRowAddEmptySpaces(date)).toEqual([])
    })
    it('Если первое число приходится на воскресенье, вернет 6 пустых ячеек', () => {
      const date = new Date(2024, 8, 1)
      expect(firstRowAddEmptySpaces(date)).toEqual([{}, {}, {}, {}, {}, {}])
    })
  })

  describe('firstRowAddEmptySpaces', () => {
    it('Если первое число приходится на понедельник, вернет пустой список', () => {
      const date = new Date(2024, 6, 1)
      expect(firstRowAddEmptySpaces(date)).toEqual([])
    })
    it('Если первое число приходится на воскресенье, вернет 6 пустых ячеек', () => {
      const date = new Date(2024, 8, 1)
      expect(firstRowAddEmptySpaces(date)).toEqual([{}, {}, {}, {}, {}, {}])
    })
  })

  describe('lastRowAddEmptySpaces', () => {
    it('Если последнее число приходится не на вск, дозаполнить последнюю строку ячейками', () => {
      const rows = [[{}, {}, {}, {}]]
      const result = lastRowAddEmptySpaces(rows)
      expect(result[0].length).toEqual(7)
    })
    it('Если количество строк < 6, добавить пустые строки', () => {
      const rows = [[{}, {}, {}, {}, {}, {}, {}]]
      const result = lastRowAddEmptySpaces(rows)
      expect(result.length).toEqual(6)
    })
  })

  describe('compareDatesForSelection', () => {
    it.each([
      [
        {
          viewDate: new Date(2024, 8),
          day: 1,
          filterDay: new Date(2024, 8, 1),
        },
        true,
      ],
      [
        {
          viewDate: new Date(2024, 8),
          day: 1,
          filterDay: undefined,
        },
        false,
      ],
      [
        {
          viewDate: new Date(2024, 8),
          day: 1,
          filterDay: new Date(2023, 8, 1),
        },
        false,
      ],
      [
        {
          viewDate: new Date(2024, 8),
          day: 1,
          filterDay: new Date(2024, 9, 1),
        },
        false,
      ],
    ])('Если входные данные %s, то результат проверки %s', (data, result) => {
      const { viewDate, day, filterDay } = data
      expect(compareDatesForSelection(viewDate, day, filterDay)).toBe(result)
    })
  })

  describe('getDaySelection', () => {
    it.each([
      [
        {
          viewDate: new Date(2024, 8),
          day: 1,
          filter: { day: new Date(2024, 8, 1), isPeriodTypeSelected: false },
        },
        SelectionType.SELECTED,
      ],
      [
        {
          viewDate: new Date(2024, 8),
          day: 2,
          filter: { day: new Date(2024, 8, 1), isPeriodTypeSelected: false },
        },
        undefined,
      ],
    ])('Если входные данные %s, то выбранный тип %s', (data, result) => {
      const { viewDate, day, filter } = data
      expect(getDaySelection(viewDate, day, filter)).toEqual(result)
    })
  })

  describe('getMiddleDaySelection', () => {
    it.each([
      [
        {
          viewDate: new Date(2024, 8),
          day: 5,
          from: new Date(2024, 8, 1),
          to: new Date(2024, 8, 6),
        },
        true,
      ],
      [
        {
          viewDate: new Date(2023, 8),
          day: 5,
          from: new Date(2024, 8, 1),
          to: new Date(2024, 8, 6),
        },
        false,
      ],
      [
        {
          viewDate: new Date(2025, 8),
          day: 5,
          from: new Date(2024, 8, 1),
          to: new Date(2024, 8, 6),
        },
        false,
      ],
      [
        {
          viewDate: new Date(2024, 7),
          day: 5,
          from: new Date(2024, 8, 1),
          to: new Date(2024, 8, 6),
        },
        false,
      ],
      [
        {
          viewDate: new Date(2024, 9),
          day: 5,
          from: new Date(2024, 8, 1),
          to: new Date(2024, 8, 6),
        },
        false,
      ],
      [
        {
          viewDate: new Date(2024, 9),
          day: 5,
          from: new Date(2024, 8, 1),
          to: new Date(2024, 8, 6),
        },
        false,
      ],
      [
        {
          viewDate: new Date(2024, 8),
          day: 5,
          from: new Date(2024, 7, 1),
          to: new Date(2024, 8, 10),
        },
        true,
      ],
      [
        {
          viewDate: new Date(2024, 8),
          day: 11,
          from: new Date(2024, 7, 1),
          to: new Date(2024, 8, 10),
        },
        false,
      ],
      [
        {
          viewDate: new Date(2024, 8),
          day: 5,
          from: new Date(2024, 8, 1),
          to: new Date(2024, 9, 1),
        },
        true,
      ],
      [
        {
          viewDate: new Date(2024, 8),
          day: 1,
          from: new Date(2024, 8, 5),
          to: new Date(2024, 9, 1),
        },
        false,
      ],
      [
        {
          viewDate: new Date(2024, 8),
          day: 1,
          from: new Date(2024, 7, 1),
          to: new Date(2024, 9, 1),
        },
        true,
      ],
    ])('Если входные данные %s, то результат проверки %s', (data, result) => {
      const { viewDate, day, from, to } = data
      expect(getMiddleDaySelection(viewDate, day, from, to)).toEqual(result)
    })
  })

  describe('getRangeSelection', () => {
    it.each([
      [
        {
          viewDate: new Date(2024, 8),
          day: 1,
          filter: {
            isPeriodTypeSelected: true,
            period: {
              from: new Date(2024, 8, 1),
              to: new Date(2024, 8, 6),
            },
          },
        },
        SelectionType.FIRST,
      ],
      [
        {
          viewDate: new Date(2024, 8),
          day: 6,
          filter: {
            isPeriodTypeSelected: true,
            period: {
              from: new Date(2024, 8, 1),
              to: new Date(2024, 8, 6),
            },
          },
        },
        SelectionType.LAST,
      ],
      [
        {
          viewDate: new Date(2024, 8),
          day: 5,
          filter: {
            isPeriodTypeSelected: true,
            period: {
              from: new Date(2024, 8, 1),
              to: new Date(2024, 8, 6),
            },
          },
        },
        SelectionType.MIDDLE,
      ],
      [
        {
          viewDate: new Date(2024, 8),
          day: 5,
          filter: {
            isPeriodTypeSelected: true,
            period: {
              from: undefined,
              to: undefined,
            },
          },
        },
        undefined,
      ],
    ])('Если входные данные %s, то выбранный тип %s', (data, result) => {
      const { viewDate, day, filter } = data
      expect(getRangeSelection(viewDate, day, filter)).toEqual(result)
    })
  })

  describe('getSelection', () => {
    it.each([
      [
        {
          viewDate: new Date(2024, 8),
          day: 1,
          filter: {
            isPeriodTypeSelected: false,
            day: new Date(2024, 8, 1),
          },
        },
        SelectionType.SELECTED,
      ],
      [
        {
          viewDate: new Date(2024, 8),
          day: 6,
          filter: {
            isPeriodTypeSelected: true,
            period: {
              from: new Date(2024, 8, 1),
              to: new Date(2024, 8, 6),
            },
          },
        },
        SelectionType.LAST,
      ],
    ])('Если входные данные %s, то выбранный тип %s', (data, result) => {
      const { viewDate, day, filter } = data
      expect(getSelection(viewDate, day, filter)).toEqual(result)
    })
  })

  describe('getRows', () => {
    it('Полученная дата должна быть корректно разложена по строкам', () => {
      const date = new Date(2024, 8)
      const rows = getRows(date, {
        isPeriodTypeSelected: false,
        day: new Date(2024, 8, 1),
      })
      expect(rows[0][6]).toEqual({ label: '1', selectionType: SelectionType.SELECTED })
      expect(rows[5][0]).toEqual({ label: '30', selectionType: undefined })
      expect(rows.length).toEqual(6)
      rows.forEach(row => {
        expect(row.length).toEqual(7)
      })
    })
  })
})
