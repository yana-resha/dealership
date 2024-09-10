import { useEffect, useMemo, useState } from 'react'

import { useFormikContext } from 'formik'

import { RequiredProduct } from 'entities/order/model/orderSlice'
import { formatMoney, formatNumber } from 'shared/lib/utils'

import { initialValueMap } from '../config'
import { BriefOrderCalculatorFields, FormFieldNameMap } from '../types'
import { useSelectCreditProductList } from './useSelectCreditProductList'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { ApplicationSource } from 'entities/applications/application.utils'

type Params = {
  minInitialPaymentPercent: number
  maxInitialPaymentPercent: number
  minInitialPayment: number
  maxInitialPayment: number
  currentProduct: RequiredProduct | undefined
  durationMaxFromAge: number
  isGetCarsLoading: boolean
  isGetCarsSuccess: boolean
  productIdsForGovernmentProgram: string[]
}

export function useCreditProductsLimits({
  minInitialPaymentPercent,
  maxInitialPaymentPercent,
  minInitialPayment,
  maxInitialPayment,
  currentProduct,
  durationMaxFromAge,
  isGetCarsLoading,
  isGetCarsSuccess,
  productIdsForGovernmentProgram,
}: Params) {
  const [isShouldValidate, setShouldValidate] = useState(false)
  const { values, setFieldValue, setFieldTouched } = useFormikContext<BriefOrderCalculatorFields>()
  const { creditProduct, isGovernmentProgram, isDfoProgram, commonError } = values

  const { creditProductListData } = useSelectCreditProductList()
  const applicationType = useAppSelector(state => state.order.order?.orderData?.application?.appType)

  const { creditProducts, isValidCreditProduct } = useMemo(
    () =>
      (creditProductListData?.productIds || []).reduce(
        (acc, productId) => {
          const product = creditProductListData?.productsMap[productId]
          if (!product) {
            return acc
          }

          const productDurationMin = product.conditions?.reduce((conditionsAcc, condition) => {
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

          // Если product.productId === creditProduct значит в форме выбран существующий продукт
          if (product.productId === creditProduct) {
            acc.isValidCreditProduct = true
          }

          // Если выбрана гос.программа, то отфильтровываем продукты не связанные с этой гос.программой
          if (isGovernmentProgram || isDfoProgram) {
            const isCurrentProgramHasProduct = productIdsForGovernmentProgram.some(
              id => id === product.productId,
            )
            if (!isCurrentProgramHasProduct) {
              return acc
            }
          }

          acc.creditProducts.push({ value: product.productId, label: product.productName })

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
      creditProductListData?.productIds,
      creditProductListData?.productsMap,
      durationMaxFromAge,
      isDfoProgram,
      isGovernmentProgram,
      productIdsForGovernmentProgram,
    ],
  )

  // Если creditProduct пришел с Бэка, но по какой-то причине отсутствует в списке продуктов, то очищаем поле
  useEffect(() => {
    if (
      !isGetCarsLoading &&
      isGetCarsSuccess &&
      creditProductListData?.productIds &&
      !isValidCreditProduct &&
      creditProduct
    ) {
      setFieldValue(FormFieldNameMap.creditProduct, initialValueMap.creditProduct)
      // Показываем валидацию только если тип заявки CARLOANAPPLICATIONDC
      if (applicationType === ApplicationSource.CAR_LOAN_APPLICATION_DC) {
        setFieldValue(FormFieldNameMap.commonError, {
          ...commonError,
          isCurrentCreditProductNotFoundInList: true,
        })
        setShouldValidate(true)
      }
    }
  }, [
    commonError,
    creditProduct,
    creditProductListData?.productIds,
    currentProduct,
    isGetCarsLoading,
    isGetCarsSuccess,
    isValidCreditProduct,
    setFieldValue,
    applicationType,
  ])

  useEffect(() => {
    if (isShouldValidate) {
      setShouldValidate(false)
      setFieldTouched(FormFieldNameMap.creditProduct, true)
    }
  }, [isShouldValidate, setFieldTouched])

  // Если продукт вновь выбран, то очищаем ошибку
  useEffect(() => {
    if (creditProduct && isValidCreditProduct && commonError?.isCurrentCreditProductNotFoundInList) {
      setFieldTouched(FormFieldNameMap.creditProduct, false)
      setFieldValue(FormFieldNameMap.commonError, {
        ...commonError,
        isCurrentCreditProductNotFoundInList: false,
      })
    }
  }, [commonError, creditProduct, isValidCreditProduct, setFieldTouched, setFieldValue])

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
