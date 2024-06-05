import { useEffect, useMemo } from 'react'

import { useField, useFormikContext } from 'formik'

import { updateOrder } from 'entities/reduxStore/orderSlice'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { formatMoney, formatNumber } from 'shared/lib/utils'

import {
  BriefOrderCalculatorFields,
  CreditProductsData,
  FormFieldNameMap,
  InitialPaymentData,
} from '../types'

export function useCreditProductsLimits(
  initialPaymentData: InitialPaymentData,
  creditProductsData: CreditProductsData,
  durationMaxFromAge: number,
  isGetCarsLoading: boolean,
  isGetCarsSuccess: boolean,
) {
  const dispatch = useAppDispatch()

  const [, , { setValue: setCreditProduct }] = useField<string>(FormFieldNameMap.creditProduct)

  const { values } = useFormikContext<BriefOrderCalculatorFields>()
  const { creditProduct } = values
  const { minInitialPaymentPercent, maxInitialPaymentPercent, minInitialPayment, maxInitialPayment } =
    initialPaymentData
  const { creditProductListData, currentProduct } = creditProductsData

  useEffect(() => {
    dispatch(updateOrder({ productsMap: creditProductListData?.productsMap || {} }))
  }, [creditProductListData?.productsMap, dispatch])

  const { creditProducts, isValidCreditProduct } = useMemo(
    () =>
      (creditProductListData?.products || []).reduce(
        (acc, cur) => {
          const productDurationMin = cur.conditions?.reduce((conditionsAcc, condition) => {
            if (
              typeof condition.durationMin === 'number' &&
              conditionsAcc &&
              condition.durationMin < conditionsAcc
            ) {
              conditionsAcc = condition.durationMin
            }

            return conditionsAcc
          }, creditProductListData?.fullDurationMax)

          if (productDurationMin && productDurationMin > durationMaxFromAge) {
            return acc
          }

          if (cur.productId === creditProduct) {
            acc.isValidCreditProduct = true
          }
          acc.creditProducts.push({ value: cur.productId, label: cur.productName })

          return acc
        },
        {
          creditProducts: [],
          isValidCreditProduct: false,
        } as {
          creditProducts: { value: string; label: string }[]
          isValidCreditProduct: boolean
        },
      ),
    [
      creditProduct,
      creditProductListData?.fullDurationMax,
      creditProductListData?.products,
      durationMaxFromAge,
    ],
  )

  // Если creditProduct пришел с Бэка, но по какой-то причине не проходит по сроку, то очищаем поле
  useEffect(() => {
    if (
      !isGetCarsLoading &&
      isGetCarsSuccess &&
      creditProductListData?.products &&
      !isValidCreditProduct &&
      creditProduct
    ) {
      setCreditProduct('')
    }
    // Исключили setCreditProduct что бы избежать случайного перерендера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditProduct, currentProduct])

  /*
  Сформирована на основе минимального и максимального Первоначального взноса
  подсказка для данного поля. Просто возвращается компоненту.
  */
  const initialPaymentPercentHelperText = useMemo(
    () =>
      `от ${formatNumber(minInitialPaymentPercent)} до ${formatNumber(maxInitialPaymentPercent, {
        postfix: '%',
      })}`,
    [maxInitialPaymentPercent, minInitialPaymentPercent],
  )

  // То же для ПВ в абсолютных единицах
  const initialPaymentHelperText = useMemo(
    () => `от ${formatNumber(minInitialPayment)} до ${formatMoney(maxInitialPayment)}`,
    [maxInitialPayment, minInitialPayment],
  )

  return {
    creditProducts,
    initialPaymentPercentHelperText,
    initialPaymentHelperText,
    values,
  }
}
