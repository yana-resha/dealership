import { DateCellType, DateFilterState, SelectionType } from './DateFilter.types'

export const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

//Если первое число приходится не на понедельник, добавляем пустые ячейки
export const firstRowAddEmptySpaces = (date: Date) => {
  const mod = new Date(date)
  mod.setDate(0)
  const firstdayOfWeek = mod.getDay()
  if (firstdayOfWeek === 0) {
    return []
  }
  const row = []
  for (let i = 0; i < firstdayOfWeek; i++) {
    row.push({})
  }

  return row
}

//Если последнее число месяца приходится не на вс, добавляем пустые ячейки
export const lastRowAddEmptySpaces = (rows: DateCellType[][]) => {
  const mod = [...rows]
  const last = mod[mod.length - 1]
  while (last.length !== 7) {
    last.push({})
  }
  //если количество строк меньше 6, добавляем пустые
  //чтобы календарь не скакал по высоте
  while (mod.length !== 6) {
    mod.push([{}, {}, {}, {}, {}, {}, {}])
  }

  return mod
}

export const compareDatesForSelection = (viewDate: Date, day: number, filterDate?: Date) => {
  if (!filterDate) {
    return false
  }
  if (viewDate.getFullYear() !== filterDate.getFullYear()) {
    return false
  }
  if (viewDate.getMonth() !== filterDate.getMonth()) {
    return false
  }

  return day === filterDate.getDate()
}

export const getDaySelection = (viewDate: Date, day: number, filter: DateFilterState) => {
  const { day: filterDate } = filter

  return compareDatesForSelection(viewDate, day, filterDate) ? SelectionType.SELECTED : undefined
}

export const getMiddleDaySelection = (viewDate: Date, day: number, from: Date, to: Date) => {
  if (viewDate.getFullYear() < from.getFullYear() || viewDate.getFullYear() > to.getFullYear()) {
    return false
  }
  if (viewDate.getMonth() < from.getMonth() || viewDate.getMonth() > to.getMonth()) {
    return false
  }
  if (viewDate.getMonth() > from.getMonth() && viewDate.getMonth() === to.getMonth()) {
    return day < to.getDate()
  }
  if (viewDate.getMonth() === from.getMonth() && viewDate.getMonth() < to.getMonth()) {
    return day > from.getDate()
  }
  if (viewDate.getMonth() > from.getMonth() && viewDate.getMonth() < to.getMonth()) {
    return true
  }

  return day > from.getDate() && day < to.getDate()
}

export const getRangeSelection = (viewDate: Date, day: number, filter: DateFilterState) => {
  const { period } = filter
  if (!period) {
    return undefined
  }
  const { from, to } = period
  if (compareDatesForSelection(viewDate, day, from)) {
    return SelectionType.FIRST
  }
  if (compareDatesForSelection(viewDate, day, to)) {
    return SelectionType.LAST
  }
  if (!from || !to) {
    return undefined
  }

  return getMiddleDaySelection(viewDate, day, from, to) ? SelectionType.MIDDLE : undefined
}

export const getSelection = (viewDate: Date, day: number, filter: DateFilterState) => {
  if (filter.isPeriodTypeSelected) {
    return getRangeSelection(viewDate, day, filter)
  }

  return getDaySelection(viewDate, day, filter)
}

export const getRows = (date: Date, filter: DateFilterState) => {
  const d = new Date(date)
  const numberOfDays = daysInMonth(d)
  const rows = [firstRowAddEmptySpaces(d)]
  for (let i = 1; i <= numberOfDays; i++) {
    const row = rows[rows.length - 1]
    const selection = getSelection(date, i, filter)
    if (row.length === 7) {
      rows.push([])
      const row1 = rows[rows.length - 1]
      row1.push({
        label: `${i}`,
        selectionType: selection,
      })
    } else {
      row.push({
        label: `${i}`,
        selectionType: selection,
      })
    }
  }

  return lastRowAddEmptySpaces(rows)
}

export const isSameDatesIgnoreTime = (date1?: Date, date2?: Date) => {
  if (!date1 || !date2) {
    return false
  }

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export const isDateBetween = (from: Date, to: Date, value: Date) =>
  isSameDatesIgnoreTime(from, value) ||
  isSameDatesIgnoreTime(to, value) ||
  (value.valueOf() >= from.valueOf() && value.valueOf() <= to.valueOf())

const MS_PER_DAY = 1000 * 60 * 60 * 24

export const dateDiffInDays = (a: Date, b: Date) => {
  //избавляемся от времени
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

  return Math.floor(Math.abs(utc2 - utc1) / MS_PER_DAY)
}
