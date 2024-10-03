export enum SelectionType {
  SELECTED,
  FIRST,
  LAST,
  MIDDLE,
}

export enum CalendarType {
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
}

export type DateCellType = {
  label?: string
  selectionType?: SelectionType
}

export type DateFilterState = {
  day?: Date
  period?: DateFilterPeriod
  isPeriodTypeSelected: boolean
}

export type DateFilterPeriod = {
  from?: Date
  to?: Date
}
