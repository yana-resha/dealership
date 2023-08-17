import { useEffect, useMemo, useState } from 'react'

import { OptionID } from '@sberauto/dictionarydc-proto/public'
import { Form, useFormikContext } from 'formik'

import { fullInitialValueMap } from 'common/OrderCalculator/config'
import { useCreditProducts } from 'common/OrderCalculator/hooks/useCreditProducts'
import { FullOrderCalculatorFields } from 'common/OrderCalculator/types'
import {
  RequisitesForFinancing,
  useRequisitesForFinancingQuery,
} from 'entities/application/AdditionalOptionsRequisites/hooks/useRequisitesForFinancingQuery'
import { RequisitesContextProvider } from 'entities/application/AdditionalOptionsRequisites/ui/RequisitesContext'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import { CarSettingsArea } from './CarSettingsArea/CarSettingsArea'
import { OrderSettingsArea } from './OrderSettingsArea/OrderSettingsArea'

type Props = {
  isSubmitLoading: boolean
  onChangeForm: () => void
  shouldFetchProductsOnStart: boolean
}

export function FormContainer({ isSubmitLoading, onChangeForm, shouldFetchProductsOnStart }: Props) {
  const { values } = useFormikContext<FullOrderCalculatorFields>()
  const { vendorCode } = getPointOfSaleFromCookies()
  const [requisites, setRequisites] = useState<RequisitesForFinancing | undefined>()

  const additionalOptionsIds = useMemo(
    () =>
      [...values.bankAdditionalServices, ...values.dealerAdditionalServices]
        .map(s => s.productType)
        .filter(s => !!s) as OptionID[],
    [values.bankAdditionalServices, values.dealerAdditionalServices],
  )
  const additionalEquipmentsIds = useMemo(
    () => [...values.additionalEquipments].map(s => s.productType).filter(s => !!s) as OptionID[],
    [values.additionalEquipments],
  )
  const {
    data: requisitesData,
    isError: isRequisitesQueryError,
    isLoading: isRequisitesQueryLoading,
    isSuccess: isRequisitesQuerySuccess,
  } = useRequisitesForFinancingQuery({
    vendorCode,
    additionalOptions: additionalOptionsIds,
    additionalEquipments: additionalEquipmentsIds,
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
      <RequisitesContextProvider requisites={requisites} isRequisitesFetched={isRequisitesFetched}>
        <CarSettingsArea
          onFilled={changeShouldFetchProducts}
          visibleFooter={!shouldShowOrderSettings}
          isLoading={isLoading}
        />
        <OrderSettingsArea
          disabled={!shouldShowOrderSettings}
          disabledSubmit={isRequisitesQueryLoading}
          isSubmitLoading={isSubmitLoading}
        />
      </RequisitesContextProvider>
    </Form>
  )
}
