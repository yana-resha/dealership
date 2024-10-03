import { useEffect, useMemo, useState } from 'react'

import { DateTime } from 'luxon'
import { useDispatch } from 'react-redux'

import { setDate } from 'entities/filters/model/filterSlice'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

import { CalendarType, DateFilterState } from '../DateFilter.types'
import { dateDiffInDays, getRows, isDateBetween, isSameDatesIgnoreTime } from '../dateFilter.utils'

export const useDateFilterState = (open: Boolean) => {
  const [calendarType, setCalendarType] = useState<CalendarType>(CalendarType.DAY)
  const [filter, setFilter] = useState<DateFilterState>({ isPeriodTypeSelected: false })
  const [viewDate, setViewDate] = useState<Date>(new Date())

  const filters = useAppSelector(state => state.filter?.date)
  const dispatch = useDispatch()

  const rows = useMemo(() => getRows(viewDate, filter), [viewDate, filter])

  const handleBackBtnClick = () => {
    const d = new Date(viewDate)
    d.setMonth(d.getMonth() - 1)
    setViewDate(d)
  }

  const handleForwardBtnClick = () => {
    const d = new Date(viewDate)
    d.setMonth(d.getMonth() + 1)
    setViewDate(d)
  }

  const handleChangeType = () => {
    setFilter(prev => ({
      day: undefined,
      period: undefined,
      isPeriodTypeSelected: !prev.isPeriodTypeSelected,
    }))
  }

  const resetFilter = () => {
    setFilter(prev => ({
      day: undefined,
      period: undefined,
      isPeriodTypeSelected: prev.isPeriodTypeSelected,
    }))
  }

  const changeDay = (day?: string) => {
    const mod = new Date(viewDate)
    mod.setDate(Number(day))
    if (isSameDatesIgnoreTime(mod, filter.day)) {
      resetFilter()

      return
    }
    setFilter(prev => ({
      day: mod,
      period: undefined,
      isPeriodTypeSelected: prev.isPeriodTypeSelected,
    }))
  }

  const changePeriod = (day?: string) => {
    const mod = new Date(viewDate)
    mod.setDate(Number(day))
    const { period } = filter
    //первым кликом выбираем начало периода
    if (!period) {
      setFilter(prev => ({ ...prev, period: { from: mod, to: undefined } }))

      return
    }

    const { from, to } = period
    //если не выбран конец отрезка и кликнули на тот же день, что был выбран началом, сбрасываем
    if (!from || isSameDatesIgnoreTime(mod, from)) {
      resetFilter()

      return
    }
    //вторым кликом выбираем конец периода, если он не выбран
    if (!to) {
      //если выбранный конец меньше начала периода, устанавливаем начало на пришедшую дату
      if (mod.valueOf() <= from.valueOf()) {
        setFilter(prev => ({ ...prev, period: { from: mod, to: undefined } }))

        return
      }
      setFilter(prev => ({ ...prev, period: { from: prev?.period?.from, to: mod } }))

      return
    }

    //попадаем сюда, если период выбран
    //если кликнули на конец периода, или на дату вне периода, устанавливаем начало, сбрасываем конец
    if (isSameDatesIgnoreTime(mod, to) || !isDateBetween(from, to, mod)) {
      setFilter(prev => ({ ...prev, period: { from: mod, to: undefined } }))

      return
    }

    //если выбрана дата внутри периода
    //считаем время в днях от нее до начала и конца
    //если начало ближе, сдвигаем конец на эту дату
    //если конец ближе, сдвигаем начало на эту дату
    const fromDiff = dateDiffInDays(from, mod)
    const toDiff = dateDiffInDays(to, mod)
    if (fromDiff <= toDiff) {
      setFilter(prev => ({ ...prev, period: { from: mod, to: prev?.period?.to } }))
    } else {
      setFilter(prev => ({ ...prev, period: { from: prev?.period?.from, to: mod } }))
    }
  }

  const handleCellClick = (day?: string) => {
    if (filter.isPeriodTypeSelected) {
      changePeriod(day)
    } else {
      changeDay(day)
    }
  }

  const setMonth = (e: DateTime) => {
    const d = new Date(viewDate)
    d.setMonth(e.month - 1)
    setViewDate(d)
    setCalendarType(CalendarType.DAY)
  }

  const setYear = (e: DateTime) => {
    const d = new Date(viewDate)
    d.setFullYear(e.year)
    setViewDate(d)
    setCalendarType(CalendarType.DAY)
  }

  const handleMonthCalendarClick = () => {
    if (calendarType === CalendarType.MONTH) {
      setCalendarType(CalendarType.DAY)
    } else {
      setCalendarType(CalendarType.MONTH)
    }
  }

  const handleYearCalendarClick = () => {
    if (calendarType === CalendarType.YEAR) {
      setCalendarType(CalendarType.DAY)
    } else {
      setCalendarType(CalendarType.YEAR)
    }
  }

  const handleSubmit = () => {
    dispatch(setDate(filter))
  }

  // сеттим фильтры из редакса
  useEffect(() => {
    if (!filters?.isPeriodTypeSelected && filters?.day) {
      setFilter({
        isPeriodTypeSelected: false,
        day: new Date(filters.day),
      })

      return
    }
    if (filters?.isPeriodTypeSelected && filters?.period?.to) {
      const { from, to } = filters.period
      setFilter({
        isPeriodTypeSelected: true,
        period: {
          from: from ? new Date(from) : undefined,
          to: to ? new Date(to) : undefined,
        },
      })
    } else {
      resetFilter()
      setViewDate(new Date())
    }
  }, [filters, setFilter, setViewDate, open])

  return {
    filter,
    isPeriodTypeSelected: filter.isPeriodTypeSelected,
    viewDate,
    rows,
    handleBackBtnClick,
    handleForwardBtnClick,
    handleChangeType,
    handleCellClick,
    setMonth,
    setYear,
    calendarType,
    handleMonthCalendarClick,
    handleYearCalendarClick,
    handleSubmit,
  }
}
