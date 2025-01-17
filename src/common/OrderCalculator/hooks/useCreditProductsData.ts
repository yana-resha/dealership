import { useMemo } from 'react'

import { useFormikContext } from 'formik'
import { DateTime, Interval } from 'luxon'

import { MAX_AGE, MIN_AGE } from 'shared/config/client.config'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { stringToNumber } from 'shared/utils/stringToNumber'

import { MONTH_OF_YEAR_COUNT } from '../constants'
import { BriefOrderCalculatorFields } from '../types'
import { getMinMaxValueFromPercent, RoundOption } from '../utils/getValueFromPercent'
import { useCarSection } from './useCarSection'
import { getServicesTotalCost } from './useCreditProductsValidations'
import { useSelectCreditProductList } from './useSelectCreditProductList'

export function useCreditProductsData() {
  const { values } = useFormikContext<BriefOrderCalculatorFields>()
  const { creditProduct, carBrand, carYear, additionalEquipments } = values
  const carCost = stringToNumber(values.carCost) ?? 0
  const isFilledElementaryClientData = useAppSelector(
    state => state.order.order?.fillingProgress?.isFilledElementaryClientData,
  )

  const birthDate = useAppSelector(
    state => state.order.order?.orderData?.application?.applicant?.birthDate || state.order.order?.birthDate,
  )

  const { creditProductListData, isCreditProductListLoading, isCreditProductListSuccess } =
    useSelectCreditProductList()

  const { data: carsInfo, isLoading: isGetCarsLoading, isSuccess: isGetCarsSuccess } = useCarSection()
  const currentProduct = useMemo(
    () => creditProductListData?.productsMap?.[`${creditProduct}`],
    [creditProduct, creditProductListData?.productsMap],
  )

  const carMaxAge = carBrand ? carsInfo.brandMap[carBrand]?.maxCarAge ?? 0 : 0
  const durationMaxFromCarAge = carYear
    ? (carMaxAge - (new Date().getFullYear() - carYear)) * MONTH_OF_YEAR_COUNT
    : 0

  const clientAge = birthDate
    ? Math.ceil(
        Interval.fromDateTimes(DateTime.fromJSDate(new Date(birthDate)), DateTime.now()).toDuration('years')
          .years,
      )
    : !isFilledElementaryClientData
    ? MIN_AGE
    : undefined

  const durationMaxFromClientAge = clientAge ? (MAX_AGE - clientAge) * MONTH_OF_YEAR_COUNT : 0

  const durationMaxFromAge = Math.min(durationMaxFromCarAge, durationMaxFromClientAge)

  // Находим крайние значения Downpayment и Duration для ограничения полей ПВ и срока,
  // когда кредитный продукт выбран: из всех conditions находим меньшее значение downpaymentMin и
  // меньшее значение downpaymentMax, то же самое делаем для duration.
  const { currentDownpaymentMin, currentDownpaymentMax, currentDurationMin, currentDurationMax } = useMemo(
    () =>
      currentProduct?.conditions?.reduce<{
        currentDownpaymentMin?: number
        currentDownpaymentMax?: number
        currentDurationMin?: number
        currentDurationMax?: number
      }>(
        (acc, condition) => {
          if (acc.currentDownpaymentMin === undefined) {
            acc.currentDownpaymentMin = condition.downpaymentMin
          } else if (
            typeof condition.downpaymentMin === 'number' &&
            condition.downpaymentMin < acc.currentDownpaymentMin
          ) {
            acc.currentDownpaymentMin = condition.downpaymentMin
          }

          if (acc.currentDownpaymentMax === undefined) {
            acc.currentDownpaymentMax = condition.downpaymentMax
          } else if (
            typeof condition.downpaymentMax === 'number' &&
            condition.downpaymentMax > acc.currentDownpaymentMax
          ) {
            acc.currentDownpaymentMax = condition.downpaymentMax
          }

          if (acc.currentDurationMin === undefined) {
            acc.currentDurationMin = condition.durationMin
          } else if (
            typeof condition.durationMin === 'number' &&
            condition.durationMin < acc.currentDurationMin
          ) {
            acc.currentDurationMin = condition.durationMin
          }

          if (acc.currentDurationMax === undefined) {
            acc.currentDurationMax = condition.durationMax
          } else if (
            typeof condition.durationMax === 'number' &&
            condition.durationMax > acc.currentDurationMax
          ) {
            acc.currentDurationMax = condition.durationMax
          }

          return acc
        },
        {
          currentDownpaymentMin: undefined,
          currentDownpaymentMax: undefined,
          currentDurationMin: undefined,
          currentDurationMax: undefined,
        },
      ) || {},
    [currentProduct?.conditions],
  )

  const onlyCreditAdditionalEquipmentsCost = getServicesTotalCost(additionalEquipments, true)
  const minInitialPaymentPercent = currentDownpaymentMin ?? creditProductListData?.fullDownpaymentMin ?? 0
  const maxInitialPaymentPercent = currentDownpaymentMax ?? creditProductListData?.fullDownpaymentMax ?? 100
  const minInitialPayment = getMinMaxValueFromPercent(
    minInitialPaymentPercent,
    carCost + onlyCreditAdditionalEquipmentsCost,
    RoundOption.min,
  )
  const maxInitialPayment = getMinMaxValueFromPercent(
    maxInitialPaymentPercent,
    carCost + onlyCreditAdditionalEquipmentsCost,
    RoundOption.max,
  )

  const isLoadedCreditProducts = !isCreditProductListLoading && isCreditProductListSuccess

  return {
    creditProductListData,
    minInitialPaymentPercent,
    maxInitialPaymentPercent,
    minInitialPayment,
    maxInitialPayment,
    currentProduct,
    currentDurationMin,
    currentDurationMax,
    clientAge,
    durationMaxFromAge,
    currentDownpaymentMin,
    currentDownpaymentMax,
    isGetCarsLoading,
    isGetCarsSuccess,
    isLoadedCreditProducts,
    isLoading: isCreditProductListLoading || isGetCarsLoading,
    isSuccess: isCreditProductListSuccess && isGetCarsSuccess,
  }
}
