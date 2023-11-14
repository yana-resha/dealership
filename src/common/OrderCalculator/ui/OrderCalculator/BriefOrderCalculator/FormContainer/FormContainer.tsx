import { useMemo } from 'react'

import { Form, useFormikContext } from 'formik'

import { initialValueMap } from 'common/OrderCalculator/config'
import { useCreditProducts } from 'common/OrderCalculator/hooks/useCreditProducts'
import { useDisableFormSubmit } from 'common/OrderCalculator/hooks/useDisableFormSubmit'
import { useFormChanging } from 'common/OrderCalculator/hooks/useFormChanging'
import { BriefOrderCalculatorFields } from 'common/OrderCalculator/types'

import { CarSettingsArea } from './CarSettingsArea/CarSettingsArea'
import { OrderSettingsArea } from './OrderSettingsArea/OrderSettingsArea'

type Props = {
  isSubmitLoading: boolean
  shouldFetchProductsOnStart: boolean
  onChangeForm: (saveValuesToStoreCb: () => void) => void
  remapApplicationValues: (values: BriefOrderCalculatorFields) => void
  isDisabledFormSubmit: boolean
  enableFormSubmit: () => void
}

export function FormContainer({
  isSubmitLoading,
  shouldFetchProductsOnStart,
  onChangeForm,
  remapApplicationValues,
  isDisabledFormSubmit,
  enableFormSubmit,
}: Props) {
  const { values } = useFormikContext<BriefOrderCalculatorFields>()

  const formFields = useMemo(
    () => ({
      carCondition: values.carCondition,
      carBrand: values.carBrand,
      carModel: values.carModel,
      carYear: values.carYear,
      carCost: values.carCost,
      carMileage: values.carMileage,
    }),
    [
      values.carBrand,
      values.carCondition,
      values.carCost,
      values.carMileage,
      values.carModel,
      values.carYear,
    ],
  )

  const { isLoading, shouldShowOrderSettings, changeShouldFetchProducts } = useCreditProducts({
    shouldFetchProductsOnStart,
    formFields,
    initialValueMap,
  })
  useFormChanging({ remapApplicationValues, onChangeForm, enableFormSubmit })

  return (
    <Form>
      <CarSettingsArea
        onFilled={changeShouldFetchProducts}
        visibleFooter={!shouldShowOrderSettings}
        isLoading={isLoading}
      />
      <OrderSettingsArea
        disabled={!shouldShowOrderSettings}
        isSubmitLoading={isSubmitLoading}
        isDisabledSubmit={isDisabledFormSubmit}
      />
    </Form>
  )
}
