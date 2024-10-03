import { useMemo } from 'react'

import { getStatusCodeByPrepared, PreparedStatus } from 'entities/applications/application.utils'
import { PreparedTableData } from 'entities/applications/ApplicationTable/ApplicationTable.types'
import { Filter } from 'entities/filters/model/filterSlice'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { isDateBetween, isSameDatesIgnoreTime } from 'shared/ui/DateFilter'

type FilterCheckingConfig = {
  isEnabled: (filter: Filter) => boolean
  check: (app: PreparedTableData, filter: Filter) => boolean
}

const checkDate = (app: PreparedTableData, filter: Filter) => {
  const { applicationCreatedDate } = app
  if (!applicationCreatedDate) {
    return false
  }
  const { date } = filter
  const { day, period } = date ?? {}
  if (day) {
    return isSameDatesIgnoreTime(new Date(applicationCreatedDate), new Date(day))
  }
  const { from = new Date(), to = new Date() } = period ?? {}

  return isDateBetween(new Date(from), new Date(to), new Date(applicationCreatedDate))
}

const checkStatus = (app: PreparedTableData, filter: Filter) => {
  const { status } = app
  const codes = filter.statuses
    .map(s => getStatusCodeByPrepared(PreparedStatus[s as keyof typeof PreparedStatus]))
    .flat(1)

  return !!codes.includes(status)
}

const isDateEnabled = (filter: Filter) => !!filter.date?.day || !!filter.date?.period?.to

const isStatusEnabled = (filter: Filter) => !!filter.statuses?.length

const FILTERS_CHECKING_CONFIG: FilterCheckingConfig[] = [
  {
    isEnabled: isDateEnabled,
    check: checkDate,
  },
  {
    isEnabled: isStatusEnabled,
    check: checkStatus,
  },
]

const checkTableData = (app: PreparedTableData, filter: Filter, checks: FilterCheckingConfig[]) =>
  checks.every(c => c.check(app, filter))

export const useApplicationFilters = (data?: PreparedTableData[]) => {
  const filters = useAppSelector(state => state.filter)

  const { filteredData, isEnabled } = useMemo(() => {
    const activeChecks = FILTERS_CHECKING_CONFIG.filter(c => c.isEnabled(filters))
    const isEnabled = !!activeChecks.length
    if (!data) {
      return { filteredData: undefined, isEnabled }
    }
    if (!isEnabled) {
      return { filteredData: data, isEnabled }
    }

    return {
      filteredData: data.filter(app => checkTableData(app, filters, activeChecks)),
      isEnabled,
    }
  }, [filters, data])

  return {
    isEnabled,
    filteredData,
  }
}
