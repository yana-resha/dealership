import { useEffect, useMemo } from 'react'

import { useFormikContext } from 'formik'

import { MIN_LOAN_YEAR_TERM, getCarYears } from '../config'
import { BriefOrderCalculatorFields, FormFieldNameMap } from '../types'
import { useCarSection } from './useCarSection'

// Обрезаем массив годом выпуска по максимальному возрасту авто
// (месяцы игнорируются для авто - январь или декабрь не важно, 1 января возрасту авто добавляется 1 год)
export function getTrimmedСarYears(carYears: { value: number }[], carMaxAge: number | undefined) {
  if (!carMaxAge) {
    return carYears
  }
  const currentYear = new Date().getFullYear()
  // Нельзя выдавать кредит на авто, которое уже достигло максимального возраста,
  // или достигнет его до истечения срока кредита. Потому добавляем MIN_LOAN_YEAR_TERM -
  // т.к. нет смысла ставить год, при котором даже кредит на минимальный срок нельзя выдать.
  const minCarYear = currentYear - carMaxAge + MIN_LOAN_YEAR_TERM

  return [...carYears].reduce((acc, cur, i, arr) => {
    if (cur.value >= minCarYear) {
      acc.push(cur)
    } else {
      arr.splice(1)
    }

    return acc
  }, [] as typeof carYears)
}

export function useCarYears() {
  const { data: carsInfo } = useCarSection()
  const { values, setFieldValue } = useFormikContext<BriefOrderCalculatorFields>()

  const carMaxAge = carsInfo.brandMap[values.carBrand ?? '']?.maxCarAge
  const carYears = useMemo(() => {
    const carYears = getCarYears(!!values.carCondition)
    const trimmedСarYears = getTrimmedСarYears(carYears, carMaxAge)

    return trimmedСarYears
  }, [carMaxAge, values.carCondition])

  useEffect(() => {
    if (values.carYear && (carYears.every(year => year.value !== values.carYear) || !values.carBrand)) {
      setFieldValue(FormFieldNameMap.carYear, undefined)
    }
  }, [carYears, setFieldValue, values.carBrand, values.carYear])

  return { carYears }
}
