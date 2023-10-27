import { useEffect } from 'react'

import { useFormikContext } from 'formik'
import isEqual from 'lodash/isEqual'

import { usePrevious } from 'shared/hooks/usePrevious'

import { FullOrderCalculatorFields, OrderCalculatorFields } from '../types'

interface UseCreditProductParams<T> {
  remapApplicationValues: (values: T) => void
  onChangeForm: (saveValuesToStoreCb: () => void) => void
}

export function useFormChanging<T extends FullOrderCalculatorFields | OrderCalculatorFields>({
  remapApplicationValues,
  onChangeForm,
}: UseCreditProductParams<T>) {
  const { values } = useFormikContext<T>()

  const prevValues = usePrevious({
    ...values,
    initialPaymentPercent: undefined,
    validationParams: {},
    commonError: {},
  })
  useEffect(() => {
    // initialPaymentPercent присвоено значение undefined, чтобы игнорировать это поле при сравнении,
    // т.к. в common/OrderCalculator/hooks/useLimits.ts при монтировании этому полю присваивается значение,
    // что приводит к изменению формы, хотя по факту ее значение никто не менял.
    const newValues = { ...values, initialPaymentPercent: undefined, validationParams: {}, commonError: {} }
    if (!isEqual(newValues, prevValues)) {
      onChangeForm(() => remapApplicationValues(newValues))
    }
  }, [onChangeForm, prevValues, remapApplicationValues, values])
}
