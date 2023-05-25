import { useCallback, useEffect, useMemo, useState } from 'react'

import { Form, useFormikContext } from 'formik'

import { initialValueMap, useGetCreditProductListQuery } from 'entities/OrderCalculator'
import { OrderCalculatorFields } from 'entities/OrderCalculator'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import { CarSettingsArea } from './CarSettingsArea/CarSettingsArea'
import { OrderSettingsArea } from './OrderSettingsArea/OrderSettingsArea'

type Props = {
  isOfferLoading: boolean
  onChangeForm: () => void
}

export function FormContainer({ isOfferLoading, onChangeForm }: Props) {
  const { values, setValues } = useFormikContext<OrderCalculatorFields>()
  const { vendorCode } = getPointOfSaleFromCookies()
  const [sentParams, setSentParams] = useState({})
  const [shouldShowOrderSettings, setShouldShowOrderSettings] = useState(false)
  const [shouldFetchProducts, setShouldFetchProducts] = useState(false)
  const changeShouldFetchProducts = useCallback(() => setShouldFetchProducts(true), [])

  const isChangedBaseValues = useMemo(
    () => Object.entries(sentParams).some(e => values[e[0] as keyof OrderCalculatorFields] !== e[1]),
    [sentParams, values],
  )

  const { data, isError, isFetching } = useGetCreditProductListQuery({
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
      }
      setShouldFetchProducts(false)
      setSentParams(formFields)
      setValues({ ...initialValueMap, ...formFields })
    }
  }, [
    isFetching,
    setValues,
    values.carBrand,
    values.carCondition,
    values.carCost,
    values.carMileage,
    values.carModel,
    values.carYear,
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
      <CarSettingsArea onFilled={changeShouldFetchProducts} />
      <OrderSettingsArea disabled={!shouldShowOrderSettings} isSubmitLoading={isOfferLoading} />
    </Form>
  )
}
