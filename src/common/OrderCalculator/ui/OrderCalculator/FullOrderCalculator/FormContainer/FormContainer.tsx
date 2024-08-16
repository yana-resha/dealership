import { useEffect, useMemo, useState } from 'react'

import { Form, useFormikContext } from 'formik'

import { fullInitialValueMap } from 'common/OrderCalculator/config'
import { useCreditProducts } from 'common/OrderCalculator/hooks/useCreditProducts'
import { useFormChanging } from 'common/OrderCalculator/hooks/useFormChanging'
import { useScrollToOrderSettingsArea } from 'common/OrderCalculator/hooks/useScrollToOrderSettingsArea'
import { FullOrderCalculatorFields } from 'common/OrderCalculator/types'
import { ProgramSwitchesArea } from 'common/OrderCalculator/ui/ProgramSwitchesArea/ProgramSwitchesArea'
import {
  RequisitesForFinancing,
  useRequisitesForFinancingQuery,
} from 'entities/applications/AdditionalOptionsRequisites/hooks/useRequisitesForFinancingQuery'
import { RequisitesContextProvider } from 'entities/applications/AdditionalOptionsRequisites/ui/RequisitesContext'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { useScrollToErrorField } from 'shared/hooks/useScrollToErrorField'

import { CarSettingsArea } from './CarSettingsArea/CarSettingsArea'
import { OrderSettingsArea } from './OrderSettingsArea/OrderSettingsArea'

type Props = {
  isSubmitLoading: boolean
  shouldFetchProductsOnStart: boolean
  onChangeForm: (saveValuesToStoreCb: () => void) => void
  remapApplicationValues: (values: FullOrderCalculatorFields) => void
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
  const { values } = useFormikContext<FullOrderCalculatorFields>()
  const { vendorCode } = getPointOfSaleFromCookies()
  useScrollToErrorField()
  const orderSettingsAreaRef = useScrollToOrderSettingsArea(creditProductId)

  const [requisites, setRequisites] = useState<RequisitesForFinancing | undefined>()

  const additionalEquipmentsIds = useMemo(
    () => values.additionalEquipments.map(s => s.productType).filter(s => !!s) as string[],
    [values.additionalEquipments],
  )
  const additionalOptionsIds = useMemo(
    () => values.dealerAdditionalServices.map(s => s.productType).filter(s => !!s) as string[],
    [values.dealerAdditionalServices],
  )
  const bankAdditionalOptionsIds = useMemo(
    () => values.bankAdditionalServices.map(s => s.productType).filter(s => !!s) as string[],
    [values.bankAdditionalServices],
  )

  const {
    data: requisitesData,
    isError: isRequisitesQueryError,
    isLoading: isRequisitesQueryLoading,
    isSuccess: isRequisitesQuerySuccess,
  } = useRequisitesForFinancingQuery({
    vendorCode,
    additionalEquipment: additionalEquipmentsIds,
    additionalOptions: additionalOptionsIds,
    bankOptions: bankAdditionalOptionsIds,
  })

  const isRequisitesFetched = !isRequisitesQueryLoading && requisitesData === requisites

  /* requisitesData необходимо класть в стейт requisites, чтобы обеспечить "Бесшовный переход" -
  в противном случае после начала запроса useRequisitesForFinancingQuery requisitesData становится undefined,
  и только по завершению запроса появляются новые данные. Даже если новые данные равны предыдущим,
  все равно происходит сброс всех ранее выбранных реквизитов (при каждом изменении списка допов).*/
  useEffect(() => {
    if (isRequisitesQueryError) {
      setRequisites(undefined)
    }
    if (isRequisitesQuerySuccess) {
      setRequisites(requisitesData)
    }
  }, [isRequisitesQueryError, isRequisitesQuerySuccess, requisitesData])

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
      carPassportType: values.carPassportType,
      carPassportId: values.carPassportId,
      carPassportCreationDate: values.carPassportCreationDate,
      carIdType: values.carIdType,
      carId: values.carId,
      salesContractId: values.salesContractId,
      salesContractDate: values.salesContractDate,
      legalPersonCode: values.legalPersonCode,
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
      values.isDfoProgram,
      values.isGovernmentProgram,
      values.legalPersonCode,
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
    creditProductId,
    resetCreditProductId,
  })
  useFormChanging({ remapApplicationValues, onChangeForm, enableFormSubmit })

  return (
    <Form data-testid="fullOrderCalculatorFormContainer">
      <ProgramSwitchesArea />
      <RequisitesContextProvider requisites={requisites} isRequisitesFetched={isRequisitesFetched}>
        <CarSettingsArea
          onFilled={changeShouldFetchProducts}
          visibleFooter={!shouldShowOrderSettings}
          isLoading={isLoading}
        />
        <OrderSettingsArea
          ref={orderSettingsAreaRef}
          disabled={!shouldShowOrderSettings}
          isDisabledSubmit={isRequisitesQueryLoading || isDisabledFormSubmit}
          isSubmitLoading={isSubmitLoading}
        />
      </RequisitesContextProvider>
    </Form>
  )
}
