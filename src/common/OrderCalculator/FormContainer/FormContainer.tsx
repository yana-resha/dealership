import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Form, useFormikContext } from 'formik'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { useGetCreditProductListQuery } from 'shared/api/getCreditProductList.api'

import { OrderCalculatorData } from '../OrderCalculator.types'
import { CarSettingsArea } from './CarSettingsArea/CarSettingsArea'
import { FooterArea } from './FooterArea/FooterArea'
import { OrderSettingsArea } from './OrderSettingsArea/OrderSettingsArea'

type Props = {
  isOfferLoading: boolean
  onChangeForm: () => void
}

export function FormContainer({ isOfferLoading, onChangeForm }: Props) {
  const { values } = useFormikContext<OrderCalculatorData>()
  const { vendorCode } = getPointOfSaleFromCookies()

  const [shouldShowOrderSettings, setShouldShowOrderSettings] = useState(false)
  const [shouldFetchProducts, setShouldFetchProducts] = useState(false)
  const changeShouldFetchProducts = useCallback(() => setShouldFetchProducts(true), [])

  const sentParamsRef = useRef({})
  const isChangedBaseValues = useMemo(
    () => Object.entries(sentParamsRef.current).some(e => values[e[0] as keyof OrderCalculatorData] !== e[1]),
    [values],
  )

  const { data, isError, isFetching } = useGetCreditProductListQuery(
    {
      vendorCode,
      model: values.carModel,
      brand: values.carBrand,
      isCarNew: !!values.carCondition,
      autoPrice: parseInt(values.carCost, 10),
      autoCreateYear: parseInt(values.carYear, 10),
      mileage: parseInt(values.carMileage, 10),
    },
    { enabled: shouldFetchProducts },
  )

  useEffect(() => {
    if (isFetching) {
      setShouldFetchProducts(false)
    }
  }, [isFetching])

  useEffect(() => {
    if (!isError && data) {
      sentParamsRef.current = {
        carCondition: values.carCondition,
        carBrand: values.carBrand,
        carModel: values.carModel,
        carYear: values.carYear,
        carCost: values.carCost,
        carMileage: values.carMileage,
      }
      setShouldShowOrderSettings(true)
    }
  }, [
    data,
    isError,
    values.carBrand,
    values.carCondition,
    values.carCost,
    values.carMileage,
    values.carModel,
    values.carYear,
  ])

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
      <OrderSettingsArea disabled={!shouldShowOrderSettings} />
      <FooterArea isOfferLoading={isOfferLoading} />
    </Form>
  )
}
