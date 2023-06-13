import { useCallback, useEffect, useMemo, useState } from 'react'

import { Form, useFormikContext } from 'formik'

import { fullInitialValueMap } from 'common/OrderCalculator/config'
import { useGetCreditProductListQuery } from 'common/OrderCalculator/hooks/useGetCreditProductListQuery'
import { FullOrderCalculatorFields } from 'common/OrderCalculator/types'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import { mockRequisites } from '../../../../../entities/application/DossierAreas/__tests__/mocks/clientDetailedDossier.mock'
import { CarSettingsArea } from './CarSettingsArea/CarSettingsArea'
import { OrderSettingsArea } from './OrderSettingsArea/OrderSettingsArea'

type Props = {
  isSubmitLoading: boolean
  onChangeForm: () => void
  shouldFetchProductsOnStart: boolean
}

export function FormContainer({ isSubmitLoading, onChangeForm, shouldFetchProductsOnStart }: Props) {
  const { values, setValues } = useFormikContext<FullOrderCalculatorFields>()
  const { vendorCode } = getPointOfSaleFromCookies()
  const requisites = mockRequisites()
  const [sentParams, setSentParams] = useState({})
  const [shouldShowOrderSettings, setShouldShowOrderSettings] = useState(false)
  const [shouldFetchProducts, setShouldFetchProducts] = useState(shouldFetchProductsOnStart)
  const changeShouldFetchProducts = useCallback(() => setShouldFetchProducts(true), [])

  const isChangedBaseValues = useMemo(
    () => Object.entries(sentParams).some(e => values[e[0] as keyof FullOrderCalculatorFields] !== e[1]),
    [sentParams, values],
  )
  const { data, isError, isFetching, isFetched } = useGetCreditProductListQuery({
    vendorCode,
    values,
    enabled: shouldFetchProducts,
  })
  useEffect(() => {
    if (isFetching) {
      const formFields = {
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
      }
      setShouldFetchProducts(false)
      setSentParams(formFields)
      if (!shouldFetchProductsOnStart || (shouldFetchProductsOnStart && isFetched)) {
        setValues({ ...fullInitialValueMap, ...formFields })
      }
    }
  }, [
    isFetched,
    isFetching,
    setValues,
    shouldFetchProductsOnStart,
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
  ])

  useEffect(() => {
    if (!isError && data && !isChangedBaseValues) {
      setShouldShowOrderSettings(true)
    }
  }, [data, isChangedBaseValues, isError])

  useEffect(() => {
    if (isChangedBaseValues) {
      setShouldShowOrderSettings(false)
    }
  }, [isChangedBaseValues])

  useEffect(() => {
    onChangeForm()
  }, [values])

  return (
    <Form>
      <CarSettingsArea onFilled={changeShouldFetchProducts} requisites={requisites.dealerCenterRequisites} />
      <OrderSettingsArea
        disabled={!shouldShowOrderSettings}
        isSubmitLoading={isSubmitLoading}
        requisites={requisites}
      />
    </Form>
  )
}
