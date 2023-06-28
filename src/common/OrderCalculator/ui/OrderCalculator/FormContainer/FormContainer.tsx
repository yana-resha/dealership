import { useCallback, useEffect, useMemo, useState } from 'react'

import { Form, useFormikContext } from 'formik'

import { initialValueMap } from 'common/OrderCalculator/config'
import { useGetCreditProductListQuery } from 'common/OrderCalculator/hooks/useGetCreditProductListQuery'
import { OrderCalculatorFields } from 'common/OrderCalculator/types'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import { CarSettingsArea } from './CarSettingsArea/CarSettingsArea'
import { OrderSettingsArea } from './OrderSettingsArea/OrderSettingsArea'

type Props = {
  isSubmitLoading: boolean
  onChangeForm: () => void
  shouldFetchProductsOnStart: boolean
}

export function FormContainer({ isSubmitLoading, onChangeForm, shouldFetchProductsOnStart }: Props) {
  const { values, setValues } = useFormikContext<OrderCalculatorFields>()
  const { vendorCode } = getPointOfSaleFromCookies()

  const [sentParams, setSentParams] = useState({})
  const [shouldShowOrderSettings, setShouldShowOrderSettings] = useState(false)
  const [shouldFetchProducts, setShouldFetchProducts] = useState(shouldFetchProductsOnStart)

  const changeShouldFetchProducts = useCallback(() => setShouldFetchProducts(true), [])

  const fetchProducts = useCallback(() => {
    setShouldFetchProducts(true)
  }, [])

  const isChangedBaseValues = useMemo(
    () => Object.entries(sentParams).some(e => values[e[0] as keyof OrderCalculatorFields] !== e[1]),
    [sentParams, values],
  )

  const { data, isError, isFetching, isFetched, isLoading } = useGetCreditProductListQuery({
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

      if (!shouldFetchProductsOnStart || (shouldFetchProductsOnStart && isFetched)) {
        setValues({ ...initialValueMap, ...formFields })
      }
    }
  }, [
    isFetched,
    isFetching,
    setValues,
    shouldFetchProductsOnStart,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  return (
    <Form>
      <CarSettingsArea
        onFilled={changeShouldFetchProducts}
        fetchProducts={fetchProducts}
        isLoading={isLoading}
      />
      <OrderSettingsArea disabled={!shouldShowOrderSettings} isSubmitLoading={isSubmitLoading} />
    </Form>
  )
}
