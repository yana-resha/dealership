import { useEffect, useMemo } from 'react'

import { useField, useFormikContext } from 'formik'

import {
  FormFieldNameMap,
  FormMessages,
  formMessages,
  useGetCreditProductListQuery,
} from 'entities/OrderCalculator'
import {
  CommonError,
  OrderCalculatorAdditionalService,
  OrderCalculatorFields,
} from 'entities/OrderCalculator'
import { getMinMaxValueFromPercent, RoundOption } from 'entities/OrderCalculator/utils/getValueFromPercent'

import { useValidationParamsContext } from './ValidationParamsContext'

const LOAN_TERM_GRADUATION_VALUE = 12

type Params = {
  vendorCode: string | undefined
}

function getServicesTotalCost(services: OrderCalculatorAdditionalService[]) {
  return services.reduce((acc, cur) => {
    if (!cur.productType || !cur.productCost) {
      return acc
    }
    const productCost = parseFloat(cur.productCost)
    if (Number.isNaN(productCost)) {
      return acc
    }

    return acc + productCost
  }, 0)
}

function checkIfExceededServicesLimit(carCost: number, criterion: boolean) {
  if (Number.isNaN(carCost)) {
    return false
  }

  return criterion
}

export function useLimits({ vendorCode }: Params) {
  const [creditProductField] = useField<string>(FormFieldNameMap.creditProduct)
  const [carCostField] = useField<string>(FormFieldNameMap.carCost)
  const [commonErrorsField, , { setValue: setCommonErrors }] = useField<CommonError>(
    FormFieldNameMap.commonError,
  )

  const { values } = useFormikContext<OrderCalculatorFields>()
  const { data } = useGetCreditProductListQuery({ vendorCode, values, enabled: false })

  const creditProducts = useMemo(
    () => data?.products.map(p => ({ value: p.productCode, label: p.productName })) || [],
    [data?.products],
  )

  const currentProducts = useMemo(
    () => data?.productsMap?.[creditProductField.value],
    [creditProductField.value, data?.productsMap],
  )

  const minInitialPaymentPercent = useMemo(
    () => currentProducts?.downpaymentMin || data?.fullDownpaymentMin,
    [currentProducts?.downpaymentMin, data?.fullDownpaymentMin],
  )
  const maxInitialPaymentPercent = useMemo(
    () => currentProducts?.downpaymentMax || data?.fullDownpaymentMax,
    [currentProducts?.downpaymentMax, data?.fullDownpaymentMax],
  )
  const minInitialPayment = useMemo(
    () => getMinMaxValueFromPercent(minInitialPaymentPercent, carCostField.value, RoundOption.min),
    [carCostField.value, minInitialPaymentPercent],
  )
  const maxInitialPayment = useMemo(
    () => getMinMaxValueFromPercent(maxInitialPaymentPercent, carCostField.value, RoundOption.max),
    [carCostField.value, maxInitialPaymentPercent],
  )

  const loanTerm = useMemo(() => {
    const durationMin =
      Math.ceil((data?.fullDurationMin || 0) / LOAN_TERM_GRADUATION_VALUE) * LOAN_TERM_GRADUATION_VALUE
    const durationMax =
      Math.floor((data?.fullDurationMax || 0) / LOAN_TERM_GRADUATION_VALUE) * LOAN_TERM_GRADUATION_VALUE
    const scaleLength = (durationMax - durationMin) / LOAN_TERM_GRADUATION_VALUE + 1
    const loanTerm = [...new Array(scaleLength)].map(
      (v, i) => `${(i + 1) * LOAN_TERM_GRADUATION_VALUE + durationMin - LOAN_TERM_GRADUATION_VALUE}`,
    )

    return loanTerm
  }, [data?.fullDurationMax, data?.fullDurationMin])

  const initialPaymentPercentHalperText = useMemo(() => {
    if (minInitialPaymentPercent && maxInitialPaymentPercent) {
      return `от ${minInitialPaymentPercent} до ${maxInitialPaymentPercent}`
    }
    if (minInitialPaymentPercent && !maxInitialPaymentPercent) {
      return `от ${minInitialPaymentPercent}`
    }
    if (!minInitialPaymentPercent && maxInitialPaymentPercent) {
      return `до ${maxInitialPaymentPercent}`
    }

    return ''
  }, [maxInitialPaymentPercent, minInitialPaymentPercent])

  const initialPaymentHalperText = useMemo(() => {
    if (minInitialPayment && maxInitialPayment) {
      return `от ${minInitialPayment} до ${maxInitialPayment}`
    }
    if (minInitialPayment && !maxInitialPayment) {
      return `от ${minInitialPayment}`
    }
    if (!minInitialPayment && maxInitialPayment) {
      return `до ${maxInitialPayment}`
    }

    return ''
  }, [maxInitialPayment, minInitialPayment])

  const { changeSchemaParams } = useValidationParamsContext()

  useEffect(() => {
    changeSchemaParams({
      minPercent: minInitialPaymentPercent,
      maxPercent: maxInitialPaymentPercent,
      minInitialPayment: minInitialPayment,
      maxInitialPayment: maxInitialPayment,
    })
  }, [
    changeSchemaParams,
    maxInitialPayment,
    maxInitialPaymentPercent,
    minInitialPayment,
    minInitialPaymentPercent,
  ])

  const carCost = useMemo(() => parseFloat(values.carCost), [values.carCost])
  const additionalEquipmentsCost = useMemo(
    () => getServicesTotalCost(values.additionalEquipments),
    [values.additionalEquipments],
  )
  const bankAdditionalServicesCost = useMemo(
    () => getServicesTotalCost(values.bankAdditionalServices),
    [values.bankAdditionalServices],
  )
  const dealerAdditionalServicesCost = useMemo(
    () => getServicesTotalCost(values.dealerAdditionalServices),
    [values.dealerAdditionalServices],
  )

  const isExceededServicesTotalLimit = useMemo(
    () =>
      checkIfExceededServicesLimit(
        carCost,
        carCost * 0.45 < additionalEquipmentsCost + bankAdditionalServicesCost + dealerAdditionalServicesCost,
      ),
    [additionalEquipmentsCost, bankAdditionalServicesCost, carCost, dealerAdditionalServicesCost],
  )
  const isExceededAdditionalEquipmentsLimit = useMemo(
    () => checkIfExceededServicesLimit(carCost, carCost * 0.3 < additionalEquipmentsCost),
    [additionalEquipmentsCost, carCost],
  )
  const isExceededDealerAdditionalServicesLimit = useMemo(
    () => checkIfExceededServicesLimit(carCost, carCost * 0.45 < dealerAdditionalServicesCost),
    [carCost, dealerAdditionalServicesCost],
  )
  const isExceededBankAdditionalServicesLimit = useMemo(
    () => checkIfExceededServicesLimit(carCost, carCost * 0.3 < bankAdditionalServicesCost),
    [bankAdditionalServicesCost, carCost],
  )

  useEffect(() => {
    const {
      isExceededServicesTotalLimit: isExceededTotalLimit,
      isExceededAdditionalEquipmentsLimit: isExceededEquipmentsLimit,
      isExceededDealerAdditionalServicesLimit: isExceededDealerServicesLimit,
      isExceededBankAdditionalServicesLimit: isExceededBankServicesLimit,
    } = commonErrorsField.value
    if (
      (isExceededTotalLimit !== undefined && isExceededTotalLimit !== isExceededServicesTotalLimit) ||
      (isExceededEquipmentsLimit !== undefined &&
        isExceededEquipmentsLimit !== isExceededAdditionalEquipmentsLimit) ||
      (isExceededDealerServicesLimit !== undefined &&
        isExceededDealerServicesLimit !== isExceededDealerAdditionalServicesLimit) ||
      (isExceededBankServicesLimit !== undefined &&
        isExceededBankServicesLimit !== isExceededBankAdditionalServicesLimit)
    ) {
      setCommonErrors({
        isExceededServicesTotalLimit: isExceededServicesTotalLimit,
        isExceededAdditionalEquipmentsLimit: isExceededAdditionalEquipmentsLimit,
        isExceededDealerAdditionalServicesLimit: isExceededDealerAdditionalServicesLimit,
        isExceededBankAdditionalServicesLimit: isExceededBankAdditionalServicesLimit,
      })
    }
  }, [
    commonErrorsField.value,
    isExceededAdditionalEquipmentsLimit,
    isExceededBankAdditionalServicesLimit,
    isExceededDealerAdditionalServicesLimit,
    isExceededServicesTotalLimit,
  ])

  const commonErrors = useMemo(
    () =>
      Object.entries(commonErrorsField.value).reduce<string[]>((acc, [key, value]) => {
        if (value) {
          acc.push(formMessages[key as keyof FormMessages])
        }

        return acc
      }, []),
    [commonErrorsField.value],
  )

  return {
    creditProducts,
    initialPaymentPercentHalperText,
    initialPaymentHalperText,
    loanTerm,
    commonErrors,
  }
}
