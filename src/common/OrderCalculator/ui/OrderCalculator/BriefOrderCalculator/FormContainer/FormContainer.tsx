import { useMemo } from 'react'

import { Form, useFormikContext } from 'formik'

import { initialValueMap } from 'common/OrderCalculator/config'
import { useCreditProducts } from 'common/OrderCalculator/hooks/useCreditProducts'
import { useFormChanging } from 'common/OrderCalculator/hooks/useFormChanging'
import { useScrollToOrderSettingsArea } from 'common/OrderCalculator/hooks/useScrollToOrderSettingsArea'
import { BriefOrderCalculatorFields } from 'common/OrderCalculator/types'
import { ProgramSwitchesArea } from 'common/OrderCalculator/ui/ProgramSwitchesArea/ProgramSwitchesArea'
import { useScrollToErrorField } from 'shared/hooks/useScrollToErrorField'

import { CarSettingsArea } from './CarSettingsArea/CarSettingsArea'
import { OrderSettingsArea } from './OrderSettingsArea/OrderSettingsArea'

type Props = {
  isSubmitLoading: boolean
  shouldFetchProductsOnStart: boolean
  onChangeForm: (saveValuesToStoreCb: () => void) => void
  remapApplicationValues: (values: BriefOrderCalculatorFields) => void
  isDisabledFormSubmit: boolean
  enableFormSubmit: () => void
  creditProductId: string | undefined
  resetCreditProductId: () => void
}

export function FormContainer({
  isSubmitLoading,
  shouldFetchProductsOnStart,
  onChangeForm,
  remapApplicationValues,
  isDisabledFormSubmit,
  enableFormSubmit,
  creditProductId,
  resetCreditProductId,
}: Props) {
  const { values } = useFormikContext<BriefOrderCalculatorFields>()
  useScrollToErrorField()
  const orderSettingsAreaRef = useScrollToOrderSettingsArea(creditProductId)

  const formFields = useMemo(
    () => ({
      isGovernmentProgram: values.isGovernmentProgram,
      isDfoProgram: values.isDfoProgram,
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
      values.isDfoProgram,
      values.isGovernmentProgram,
    ],
  )

  const { isLoading, shouldShowOrderSettings, changeShouldFetchProducts } = useCreditProducts({
    shouldFetchProductsOnStart,
    formFields,
    initialValueMap,
    creditProductId,
    resetCreditProductId,
  })
  useFormChanging({ remapApplicationValues, onChangeForm, enableFormSubmit })

  return (
    <Form>
      <ProgramSwitchesArea />
      <CarSettingsArea
        onFilled={changeShouldFetchProducts}
        visibleFooter={!shouldShowOrderSettings}
        isLoading={isLoading}
      />
      <OrderSettingsArea
        ref={orderSettingsAreaRef}
        disabled={!shouldShowOrderSettings}
        isSubmitLoading={isSubmitLoading}
        isDisabledSubmit={isDisabledFormSubmit}
      />
    </Form>
  )
}
