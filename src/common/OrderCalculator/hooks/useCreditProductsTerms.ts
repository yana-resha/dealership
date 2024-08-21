import { useEffect, useMemo } from 'react'

import { useFormikContext } from 'formik'

import { RequiredProduct } from 'entities/order/model/orderSlice'

import { LOAN_TERM_GRADUATION_VALUE, MONTH_OF_YEAR_COUNT } from '../constants'
import { BriefOrderCalculatorFields, FormFieldNameMap } from '../types'
import { useSelectCreditProductList } from './useSelectCreditProductList'

type Params = {
  currentProduct: RequiredProduct | undefined
  durationMaxFromAge: number
  currentDurationMin: number | undefined
  currentDurationMax: number | undefined
}
export function useCreditProductsTerms({
  currentProduct,
  durationMaxFromAge,
  currentDurationMin,
  currentDurationMax,
}: Params) {
  const { values, setFieldValue } = useFormikContext<BriefOrderCalculatorFields>()
  const { creditProduct, loanTerm } = values
  const { creditProductListData } = useSelectCreditProductList()
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
      setFieldValue(FormFieldNameMap.loanTerm, '')
    }
    // Исключили setLoanTerm что бы избежать случайного перерендера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditProduct, currentProduct])

  return {
    loanTerms,
    values,
  }
}
