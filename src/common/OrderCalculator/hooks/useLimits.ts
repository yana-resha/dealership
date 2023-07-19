import { useEffect, useMemo } from 'react'

import { OptionID } from '@sberauto/dictionarydc-proto/public'
import { useField, useFormikContext } from 'formik'

import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'
import { formatMoney, formatNumber } from 'shared/lib/utils'

import { formMessages } from '../config'
import {
  CommonError,
  FormFieldNameMap,
  FormMessages,
  OrderCalculatorAdditionalService,
  OrderCalculatorFields,
  ValidationParams,
} from '../types'
import { RoundOption, getMinMaxValueFromPercent } from '../utils/getValueFromPercent'
import { useGetCreditProductListQuery } from './useGetCreditProductListQuery'

const LOAN_TERM_GRADUATION_VALUE = 12
const ADDITIONAL_EQUIPMENT_FROM_CAR_COST_SETPOINT = 0.3
const DEALER_ADDITIONAL_SERVICES_FROM_CAR_COST_SETPOINT = 0.45
const BANK_ADDITIONAL_SERVICES_FROM_CAR_COST_SETPOINT = 0.3
const ALL_ADDITIONAL_SERVICES_FROM_CAR_COST_SETPOINT = 0.45

type Params = {
  vendorCode: string | undefined
}

function getServicesTotalCost(services: OrderCalculatorAdditionalService[]) {
  return services.reduce((acc, cur) => {
    if (typeof cur.productType !== 'number' || !cur.productCost) {
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
/*
Хук задает ограничения в коротком и полном калькуляторах для: полей Первоначальный взнос,
Первоначальный взнос в % и срок кредита, для стоимости доп. оборудования и  услуг.
*/
export function useLimits({ vendorCode }: Params) {
  const [creditProductField] = useField<string>(FormFieldNameMap.creditProduct)
  const [carCostField] = useField<string>(FormFieldNameMap.carCost)
  const [commonErrorsField, , { setValue: setCommonErrors }] = useField<CommonError>(
    FormFieldNameMap.commonError,
  )
  const [validationParamsField, , { setValue: setValidationParams }] = useField<ValidationParams>(
    FormFieldNameMap.validationParams,
  )

  const { values, setFieldTouched } = useFormikContext<OrderCalculatorFields>()
  const { data } = useGetCreditProductListQuery({ vendorCode, values, enabled: false })

  const creditProducts = useMemo(
    () => data?.products.map(p => ({ value: p.productId, label: p.productName })) || [],
    [data?.products],
  )
  const currentProduct = useMemo(
    () => data?.productsMap?.[creditProductField.value],
    [creditProductField.value, data?.productsMap],
  )

  const minInitialPaymentPercent = currentProduct?.downpaymentMin || data?.fullDownpaymentMin
  const maxInitialPaymentPercent = currentProduct?.downpaymentMax || data?.fullDownpaymentMax
  const minInitialPayment = getMinMaxValueFromPercent(
    minInitialPaymentPercent,
    carCostField.value,
    RoundOption.min,
  )
  const maxInitialPayment = getMinMaxValueFromPercent(
    maxInitialPaymentPercent,
    carCostField.value,
    RoundOption.max,
  )
  /*
  Сформирован на основе минимального и максимального срока кредита
  массив допустимых значений для поля Срок кредита. Просто возвращается компоненту.
  */
  const loanTerms = useMemo(() => {
    const durationMin =
      Math.ceil((currentProduct?.durationMin || data?.fullDurationMin || 0) / LOAN_TERM_GRADUATION_VALUE) *
      LOAN_TERM_GRADUATION_VALUE
    const durationMax =
      Math.floor((currentProduct?.durationMax || data?.fullDurationMax || 0) / LOAN_TERM_GRADUATION_VALUE) *
      LOAN_TERM_GRADUATION_VALUE

    if (durationMin > durationMax) {
      return []
    }

    const scaleLength = (durationMax - durationMin) / LOAN_TERM_GRADUATION_VALUE + 1
    const loanTerms = [...new Array(scaleLength)].map((v, i) => ({
      value: (i + 1) * LOAN_TERM_GRADUATION_VALUE + durationMin - LOAN_TERM_GRADUATION_VALUE,
    }))

    return loanTerms
  }, [currentProduct?.durationMax, currentProduct?.durationMin, data?.fullDurationMax, data?.fullDurationMin])

  /*
  Сформирована на основе минимального и максимального Первоначального взноса
  подсказка для данного поля. Просто возвращается компоненту.
  */
  const initialPaymentPercentHelperText = useMemo(() => {
    if (minInitialPaymentPercent && maxInitialPaymentPercent) {
      return `от ${formatNumber(minInitialPaymentPercent)} до ${formatNumber(maxInitialPaymentPercent, {
        postfix: '%',
      })}`
    }
    if (minInitialPaymentPercent && !maxInitialPaymentPercent) {
      return `от ${formatNumber(minInitialPaymentPercent, { postfix: '%' })}`
    }
    if (!minInitialPaymentPercent && maxInitialPaymentPercent) {
      return `до ${formatNumber(maxInitialPaymentPercent, { postfix: '%' })}`
    }

    return ''
  }, [maxInitialPaymentPercent, minInitialPaymentPercent])

  // То же для процентного ПВ
  const initialPaymentHelperText = useMemo(() => {
    if (minInitialPayment && maxInitialPayment) {
      return `от ${formatNumber(minInitialPayment)} до ${formatMoney(maxInitialPayment)}`
    }
    if (minInitialPayment && !maxInitialPayment) {
      return `от ${formatMoney(minInitialPayment)}`
    }
    if (!minInitialPayment && maxInitialPayment) {
      return `до ${formatMoney(maxInitialPayment)}`
    }

    return ''
  }, [maxInitialPayment, minInitialPayment])

  /*
  В initialValues формика прописано свойство validationParams. Поля для него нет,
  оно служит для передачи внешних данных (maxInitialPayment, maxInitialPaymentPercent,
  minInitialPayment, minInitialPaymentPercent) в схему валидации. В данном эффекте это и производится,
  если одно из значений изменилось
  */
  useEffect(() => {
    if (
      validationParamsField.value.maxInitialPayment !== maxInitialPayment ||
      validationParamsField.value.maxInitialPaymentPercent !== maxInitialPaymentPercent ||
      validationParamsField.value.minInitialPayment !== minInitialPayment ||
      validationParamsField.value.minInitialPaymentPercent !== minInitialPaymentPercent
    ) {
      setValidationParams({
        ...validationParamsField.value,
        maxInitialPayment,
        maxInitialPaymentPercent,
        minInitialPayment,
        minInitialPaymentPercent,
      })
    }
    // Исключили setValidationParams что бы избежать случайного перерендера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    maxInitialPayment,
    maxInitialPaymentPercent,
    minInitialPayment,
    minInitialPaymentPercent,
    validationParamsField.value,
  ])

  const carCost = parseFloat(values.carCost)
  const additionalEquipmentsCost = getServicesTotalCost(values.additionalEquipments)
  const bankAdditionalServicesCost = getServicesTotalCost(values.bankAdditionalServices)
  const dealerAdditionalServicesCost = getServicesTotalCost(values.dealerAdditionalServices)

  const isExceededServicesTotalLimit = useMemo(
    () =>
      checkIfExceededServicesLimit(
        carCost,
        carCost * ALL_ADDITIONAL_SERVICES_FROM_CAR_COST_SETPOINT <
          additionalEquipmentsCost + bankAdditionalServicesCost + dealerAdditionalServicesCost,
      ),
    [additionalEquipmentsCost, bankAdditionalServicesCost, carCost, dealerAdditionalServicesCost],
  )
  const isExceededAdditionalEquipmentsLimit = useMemo(
    () =>
      checkIfExceededServicesLimit(
        carCost,
        carCost * ADDITIONAL_EQUIPMENT_FROM_CAR_COST_SETPOINT < additionalEquipmentsCost,
      ),
    [additionalEquipmentsCost, carCost],
  )
  const isExceededDealerAdditionalServicesLimit = useMemo(
    () =>
      checkIfExceededServicesLimit(
        carCost,
        carCost * DEALER_ADDITIONAL_SERVICES_FROM_CAR_COST_SETPOINT < dealerAdditionalServicesCost,
      ),
    [carCost, dealerAdditionalServicesCost],
  )

  const isExceededBankAdditionalServicesLimit = useMemo(
    () =>
      checkIfExceededServicesLimit(
        carCost,
        carCost * BANK_ADDITIONAL_SERVICES_FROM_CAR_COST_SETPOINT < bankAdditionalServicesCost,
      ),
    [bankAdditionalServicesCost, carCost],
  )

  /*
  В initialValues формика прописано свойство commonErrors. Поля для него нет,
  оно служит для передачи внешних данных - ошибок (isExceededServicesTotalLimit,
  isExceededAdditionalEquipmentsLimit, isExceededDealerAdditionalServicesLimit,
  isExceededBankAdditionalServicesLimit) в схему валидации. В данном эффекте это и производится,
  если одно из значений изменилось
  */
  useEffect(() => {
    const {
      isExceededServicesTotalLimit: isExceededTotalLimit,
      isExceededAdditionalEquipmentsLimit: isExceededEquipmentsLimit,
      isExceededDealerAdditionalServicesLimit: isExceededDealerServicesLimit,
      isExceededBankAdditionalServicesLimit: isExceededBankServicesLimit,
    } = commonErrorsField.value

    if (
      isExceededTotalLimit !== isExceededServicesTotalLimit ||
      isExceededEquipmentsLimit !== isExceededAdditionalEquipmentsLimit ||
      isExceededDealerServicesLimit !== isExceededDealerAdditionalServicesLimit ||
      isExceededBankServicesLimit !== isExceededBankAdditionalServicesLimit
    ) {
      setCommonErrors({
        ...commonErrorsField.value,
        isExceededServicesTotalLimit,
        isExceededAdditionalEquipmentsLimit,
        isExceededDealerAdditionalServicesLimit,
        isExceededBankAdditionalServicesLimit,
      })
    }
    // Исключили setCommonErrors что бы избежать случайного перерендера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    commonErrorsField.value,
    isExceededAdditionalEquipmentsLimit,
    isExceededDealerAdditionalServicesLimit,
    isExceededBankAdditionalServicesLimit,
    isExceededServicesTotalLimit,
  ])

  const isNecessaryCasco = !!currentProduct?.cascoFlag

  /*
  В initialValues формика прописано свойство validationParams. Поля для него нет,
  оно служит для передачи внешних данных (isNecessaryCasco...) в схему валидации.
  В данном эффекте это и производится, если значение изменилось
  */
  useEffect(() => {
    if (validationParamsField.value.isNecessaryCasco !== !!currentProduct?.cascoFlag) {
      setValidationParams({
        ...validationParamsField.value,
        isNecessaryCasco: !!currentProduct?.cascoFlag,
      })
    }
    // Исключили setValidationParams что бы избежать случайного перерендера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProduct?.cascoFlag, validationParamsField.value])

  const isHasCasco = values.dealerAdditionalServices.some(e => e.productType === OptionID.CASCO)

  /*
  В initialValues формика прописано свойство commonErrors. Поля для него нет,
  оно служит для передачи внешних данных - ошибок (isHasNotCascoOption...) в схему валидации.
  В данном эффекте это и производится, если значение изменилось
  */
  useEffect(() => {
    if (isNecessaryCasco && !isHasCasco) {
      if (!commonErrorsField.value.isHasNotCascoOption) {
        setCommonErrors({
          ...commonErrorsField.value,
          isHasNotCascoOption: true,
        })
      }
    } else {
      if (commonErrorsField.value.isHasNotCascoOption) {
        setCommonErrors({
          ...commonErrorsField.value,
          isHasNotCascoOption: false,
        })
      }
    }
    // Исключили setCommonErrors что бы избежать случайного перерендера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commonErrorsField.value, currentProduct?.cascoFlag, isHasCasco])

  /*
  Если поля были предзаполнены, и кнопка submit не нажималась,
  то в случае ошики (стоимость одного допа увеличили) нужно подсветить все поля стоимостей допов.
  */
  useEffect(() => {
    if (commonErrorsField.value.isExceededAdditionalEquipmentsLimit) {
      values.additionalEquipments.forEach((e, i) =>
        setFieldTouched(`${ServicesGroupName.additionalEquipments}.${i}.${FormFieldNameMap.productCost}`),
      )
    }
    if (commonErrorsField.value.isExceededDealerAdditionalServicesLimit) {
      values.dealerAdditionalServices.forEach((e, i) =>
        setFieldTouched(`${ServicesGroupName.dealerAdditionalServices}.${i}.${FormFieldNameMap.productCost}`),
      )
    }
    if (commonErrorsField.value.isExceededBankAdditionalServicesLimit) {
      values.bankAdditionalServices.forEach((e, i) =>
        setFieldTouched(`${ServicesGroupName.bankAdditionalServices}.${i}.${FormFieldNameMap.productCost}`),
      )
    }
    // Исключили values.additionalEquipments, values.bankAdditionalServices, values.dealerAdditionalServices
    // что бы избежать случайного перерендера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commonErrorsField.value, setFieldTouched])

  // Сформирован на основе поля commonErrors массив ошибок стоимостей допов. Просто возвращается компоненту.
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
    initialPaymentPercentHelperText,
    initialPaymentHelperText,
    loanTerms,
    commonErrors,
    isNecessaryCasco,
  }
}
