import { useCallback, useEffect, useMemo, useState } from 'react'

import { useField, useFormikContext } from 'formik'

import {
  OrderCalculatorAdditionalService,
  OrderCalculatorBankAdditionalService,
} from 'common/OrderCalculator/types'
import { ServicesGroupName } from 'entities/applications/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { usePrevious } from 'shared/hooks/usePrevious'

export function useAdditionalServicesGroupe(
  name: ServicesGroupName,
  initialAdditionalService: OrderCalculatorBankAdditionalService | OrderCalculatorAdditionalService,
) {
  const [field, , { setValue: setServices }] =
    useField<(OrderCalculatorAdditionalService | OrderCalculatorBankAdditionalService)[]>(name)

  const { submitCount } = useFormikContext()
  const prevSubmitCount = usePrevious(submitCount)

  const [isShouldExpanded, setShouldExpanded] = useState(false)
  const resetShouldExpanded = useCallback(() => setShouldExpanded(false), [])

  const filteredValue = useMemo(() => field.value.filter(v => v.productType), [field.value])
  const previousFilteredValueLength = usePrevious(filteredValue.length)
  const isInitialExpanded = !!field.value.length && !!field.value[0].productType

  // удаляет все недозаполненные доп. опции из формы, при нажатии кнопки Рассчитать
  useEffect(() => {
    if (prevSubmitCount === submitCount) {
      return
    }
    const newValue = field.value.filter(v => v.productType)
    setServices(newValue.length ? newValue : [initialAdditionalService])
  }, [field.value, initialAdditionalService, prevSubmitCount, setServices, submitCount])

  /* Устанавливает флаг необходимости развернуть группу доп. опций при изменении их количества.
  Например, если при выборе КП под капотом добавилась обязательная опция */
  useEffect(() => {
    if (filteredValue.length && filteredValue.length !== previousFilteredValueLength) {
      setShouldExpanded(true)
    }
  }, [filteredValue.length, previousFilteredValueLength])

  return {
    isInitialExpanded,
    isShouldExpanded,
    resetShouldExpanded,
  }
}
