import { useEffect, useMemo } from 'react'

import { useField } from 'formik'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import { MIN_LOAN_YEAR_TERM, getCarYears } from '../config'
import { FormFieldNameMap } from '../types'
import { useGetCarsListQuery } from './useGetCarsListQuery'

// Обрезаем массив годом выпуска по максимальному возрасту авто
function getTrimmedСarYears(carYears: { value: number }[], carMaxAge: number | undefined) {
  if (!carMaxAge) {
    return carYears
  }
  const currentYear = new Date().getFullYear()
  // Нельзя выдавать кредит на авто, которое уде достигло максимального возраста,
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
  const { vendorCode } = getPointOfSaleFromCookies()
  const { data: carsData } = useGetCarsListQuery({ vendorCode }, { enabled: false })

  const [carConditionField] = useField<string | null>(FormFieldNameMap.carCondition)
  const [carBrandField] = useField<string | null>(FormFieldNameMap.carBrand)
  const [carYearField, , { setValue: setCarYear }] = useField<number | undefined>(FormFieldNameMap.carYear)

  const carMaxAge = carsData?.cars?.[carBrandField.value ?? '']?.maxCarAge
  const carYears = useMemo(() => {
    const carYears = getCarYears(!!carConditionField.value)
    const trimmedСarYears = getTrimmedСarYears(carYears, carMaxAge)

    return trimmedСarYears
  }, [carConditionField.value, carMaxAge])

  useEffect(() => {
    if (!carYears.some(year => year.value === carYearField.value) || !carBrandField.value) {
      setCarYear(undefined)
    }
    // исключен setCarYear, приводил к бесконечному ререндеру
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carBrandField.value, carConditionField.value, carYearField.value, carYears])

  return { carYears }
}
