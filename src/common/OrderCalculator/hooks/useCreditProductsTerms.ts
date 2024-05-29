import { useEffect, useMemo } from 'react'

import { useField, useFormikContext } from 'formik'

import { LOAN_TERM_GRADUATION_VALUE, MONTH_OF_YEAR_COUNT } from '../constants'
import { BriefOrderCalculatorFields, FormFieldNameMap } from '../types'
import { CreditDurationData, CreditProductsData } from './useCreditProductsData'

export function useCreditProductsTerms(
  creditDurationData: CreditDurationData,
  creditProductsData: CreditProductsData,
  durationMaxFromAge: number,
) {
  const { values } = useFormikContext<BriefOrderCalculatorFields>()
  const { creditProduct, loanTerm } = values
  const { creditProductListData, currentProduct } = creditProductsData
  const { currentDurationMin, currentDurationMax } = creditDurationData
  const [, , { setValue: setLoanTerm }] = useField<string>(FormFieldNameMap.loanTerm)

  /*
  Сформирован на основе минимального и максимального срока кредита
  массив допустимых значений для поля Срок кредита. Просто возвращается компоненту.
  */
  const loanTerms = useMemo(() => {
    const durationMin =
      Math.ceil((currentDurationMin || creditProductListData?.fullDurationMin || 0) / MONTH_OF_YEAR_COUNT) *
      MONTH_OF_YEAR_COUNT
    const durationMaxFromProduct =
      Math.floor((currentDurationMax || creditProductListData?.fullDurationMax || 0) / MONTH_OF_YEAR_COUNT) *
      MONTH_OF_YEAR_COUNT

    const durationMax = Math.min(durationMaxFromProduct, durationMaxFromAge)

    if (durationMin > durationMax || durationMax <= 0) {
      return []
    }
    const scaleLength = (durationMax - durationMin) / LOAN_TERM_GRADUATION_VALUE + 1
    const loanTerms = [...new Array(scaleLength)].map((v, i) => ({
      value: (i + 1) * LOAN_TERM_GRADUATION_VALUE + durationMin - LOAN_TERM_GRADUATION_VALUE,
    }))

    return loanTerms
  }, [
    creditProductListData?.fullDurationMax,
    creditProductListData?.fullDurationMin,
    currentDurationMax,
    currentDurationMin,
    durationMaxFromAge,
  ])

  /* Если loanTerm пришел с Бэка, но по какой-то причине не входит в диапазон допустимых сроков,
  то очищаем поле */
  useEffect(() => {
    if (!!loanTerm && loanTerms.length && !loanTerms.some(term => term.value === loanTerm)) {
      setLoanTerm('')
    }
    // Исключили setLoanTerm что бы избежать случайного перерендера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditProduct, currentProduct])

  return {
    loanTerms,
    values,
  }
}
