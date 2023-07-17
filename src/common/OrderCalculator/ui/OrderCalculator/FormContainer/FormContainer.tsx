import { useMemo } from 'react'

import { Form, useFormikContext } from 'formik'

import { initialValueMap } from 'common/OrderCalculator/config'
import { useCreditProducts } from 'common/OrderCalculator/hooks/useCreditProducts'
import { OrderCalculatorFields } from 'common/OrderCalculator/types'

import { CarSettingsArea } from './CarSettingsArea/CarSettingsArea'
import { OrderSettingsArea } from './OrderSettingsArea/OrderSettingsArea'

type Props = {
  isSubmitLoading: boolean
  onChangeForm: () => void
  shouldFetchProductsOnStart: boolean
}

export function FormContainer({ isSubmitLoading, onChangeForm, shouldFetchProductsOnStart }: Props) {
  const { values } = useFormikContext<OrderCalculatorFields>()

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
    onChangeForm,
  })

  return (
    <Form>
      <CarSettingsArea
        onFilled={changeShouldFetchProducts}
        visibleFooter={!shouldShowOrderSettings}
        isLoading={isLoading}
      />
      <OrderSettingsArea disabled={!shouldShowOrderSettings} isSubmitLoading={isSubmitLoading} />
    </Form>
  )
}
