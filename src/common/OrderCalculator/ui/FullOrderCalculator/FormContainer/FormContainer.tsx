import { useMemo } from 'react'

import { Form, useFormikContext } from 'formik'

import { fullInitialValueMap } from 'common/OrderCalculator/config'
import { useCreditProducts } from 'common/OrderCalculator/hooks/useCreditProducts'
import { FullOrderCalculatorFields } from 'common/OrderCalculator/types'
import { mockRequisites } from 'entities/application/DossierAreas/__tests__/mocks/clientDetailedDossier.mock'

import { CarSettingsArea } from './CarSettingsArea/CarSettingsArea'
import { OrderSettingsArea } from './OrderSettingsArea/OrderSettingsArea'

type Props = {
  isSubmitLoading: boolean
  onChangeForm: () => void
  shouldFetchProductsOnStart: boolean
}

export function FormContainer({ isSubmitLoading, onChangeForm, shouldFetchProductsOnStart }: Props) {
  const { values } = useFormikContext<FullOrderCalculatorFields>()
  const requisites = mockRequisites()

  const formFields = useMemo(
    () => ({
      carCondition: values.carCondition,
      carBrand: values.carBrand,
      carModel: values.carModel,
      carYear: values.carYear,
      carCost: values.carCost,
      carMileage: values.carMileage,
      carPassportType: values.carPassportType,
      carPassportId: values.carPassportId,
      carPassportCreationDate: values.carPassportCreationDate,
      carIdType: values.carIdType,
      carId: values.carId,
      salesContractId: values.salesContractId,
      salesContractDate: values.salesContractDate,
      legalPerson: values.legalPerson,
      loanAmount: values.loanAmount,
      bankIdentificationCode: values.bankIdentificationCode,
      beneficiaryBank: values.beneficiaryBank,
      bankAccountNumber: values.bankAccountNumber,
      isCustomFields: values.isCustomFields,
      correspondentAccount: values.correspondentAccount,
      taxation: values.taxation,
    }),
    [
      values.bankAccountNumber,
      values.bankIdentificationCode,
      values.beneficiaryBank,
      values.carBrand,
      values.carCondition,
      values.carCost,
      values.carId,
      values.carIdType,
      values.carMileage,
      values.carModel,
      values.carPassportCreationDate,
      values.carPassportId,
      values.carPassportType,
      values.carYear,
      values.correspondentAccount,
      values.isCustomFields,
      values.legalPerson,
      values.loanAmount,
      values.salesContractDate,
      values.salesContractId,
      values.taxation,
    ],
  )

  const { isLoading, shouldShowOrderSettings, changeShouldFetchProducts } = useCreditProducts({
    shouldFetchProductsOnStart,
    formFields,
    initialValueMap: fullInitialValueMap,
    onChangeForm,
  })

  return (
    <Form>
      <CarSettingsArea
        onFilled={changeShouldFetchProducts}
        visibleFooter={!shouldShowOrderSettings}
        requisites={requisites.dealerCenterRequisites}
        isLoading={isLoading}
      />
      <OrderSettingsArea
        disabled={!shouldShowOrderSettings}
        isSubmitLoading={isSubmitLoading}
        requisites={requisites}
      />
    </Form>
  )
}
