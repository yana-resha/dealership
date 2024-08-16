import { useMemo } from 'react'

import { useFormikContext } from 'formik'

import { BriefOrderCalculatorFields, FullOrderCalculatorFields } from '../types'
import { useSelectCreditProductList } from './useSelectCreditProductList'

export function useGovernmentPrograms() {
  const { values } = useFormikContext<FullOrderCalculatorFields | BriefOrderCalculatorFields>()
  const { isGovernmentProgram, isDfoProgram, governmentProgram } = values

  const { creditProductListData } = useSelectCreditProductList()

  const governmentPrograms = useMemo(
    () =>
      creditProductListData?.governmentProgramsMap
        ? (creditProductListData?.governmentProgramsCodes || []).map(code => ({
            value: code,
            label: creditProductListData?.governmentProgramsMap?.[code].name,
          }))
        : [],
    [creditProductListData?.governmentProgramsCodes, creditProductListData?.governmentProgramsMap],
  )
  const currentGovernmentProgram = useMemo(
    () => creditProductListData?.governmentProgramsMap[governmentProgram || ''] || null,
    [creditProductListData?.governmentProgramsMap, governmentProgram],
  )
  const productIdsForGovernmentProgram = useMemo(
    () => currentGovernmentProgram?.productIdsForGovernmentProgram || [],
    [currentGovernmentProgram?.productIdsForGovernmentProgram],
  )

  return {
    governmentPrograms,
    isGovernmentProgramEnabled: isGovernmentProgram || isDfoProgram,
    isGovernmentProgramSelected: !!currentGovernmentProgram,
    productIdsForGovernmentProgram,
  }
}
