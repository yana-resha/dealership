import { useEffect, useMemo } from 'react'

import { useField } from 'formik'

import { getCarYears } from '../config'
import { FormFieldNameMap } from '../types'

export function useCarYears() {
  const [carConditionField] = useField(FormFieldNameMap.carCondition)
  const [carYearField, , { setValue: setCarYear }] = useField(FormFieldNameMap.carYear)

  const carYears = useMemo(() => getCarYears(!!carConditionField.value), [carConditionField.value])

  useEffect(() => {
    if (carConditionField.value && !carYears.includes(carYearField.value)) {
      setCarYear(carYears[0].value)
    }
    // исключен setCarYear, приводил к бесконечному ререндеру
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carConditionField.value, carYearField.value, carYears])

  return { carYears }
}
