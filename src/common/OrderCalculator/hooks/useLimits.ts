import { useEffect, useMemo } from 'react'

import { OptionID } from '@sberauto/dictionarydc-proto/public'
import { useField, useFormikContext } from 'formik'
import { DateTime, Interval } from 'luxon'

import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { updateOrder } from 'entities/reduxStore/orderSlice'
import { MAX_AGE, MIN_AGE } from 'shared/config/client.config'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
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
import { useCarSection } from './useCarSection'
import { useGetCreditProductListQuery } from './useGetCreditProductListQuery'

const LOAN_TERM_GRADUATION_VALUE = 12
const MONTH_OF_YEAR_COUNT = 12
const ADDITIONAL_EQUIPMENT_FROM_CAR_COST_SETPOINT = 0.3
const DEALER_ADDITIONAL_SERVICES_FROM_CAR_COST_SETPOINT = 0.45
const BANK_ADDITIONAL_SERVICES_FROM_CAR_COST_SETPOINT = 0.3
const ALL_ADDITIONAL_SERVICES_FROM_CAR_COST_SETPOINT = 0.45

type Params = {
  vendorCode: string | undefined
}

function getServicesTotalCost(services: OrderCalculatorAdditionalService[], onlyCredit = false) {
  return services.reduce((acc, cur) => {
    if (typeof cur.productType !== 'number' || !cur.productCost || (onlyCredit && !cur.isCredit)) {
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
  const dispatch = useAppDispatch()
  const birthDate = useAppSelector(
    state => state.order.order?.orderData?.application?.applicant?.birthDate || state.order.order?.birthDate,
  )
  const isFilledElementaryClientData = useAppSelector(
    state => state.order.order?.fillingProgress?.isFilledElementaryClientData,
  )

  const [commonErrorsField, , { setValue: setCommonErrors }] = useField<CommonError>(
    FormFieldNameMap.commonError,
  )
  const [validationParamsField, , { setValue: setValidationParams }] = useField<ValidationParams>(
    FormFieldNameMap.validationParams,
  )
  const [, , { setValue: setCreditProduct }] = useField<string>(FormFieldNameMap.creditProduct)
  const [, , { setValue: setLoanTerm }] = useField<string>(FormFieldNameMap.loanTerm)

  const { values, setFieldTouched } = useFormikContext<OrderCalculatorFields>()
  const {
    carBrand,
    carYear,
    creditProduct,
    loanTerm,
    additionalEquipments,
    bankAdditionalServices,
    dealerAdditionalServices,
  } = values
  const carCost = parseFloat(values.carCost)

  const { data, isLoading, isSuccess } = useGetCreditProductListQuery({ vendorCode, values, enabled: false })
  const { cars } = useCarSection()

  useEffect(() => {
    dispatch(updateOrder({ creditProductsList: data?.products }))
  }, [data, dispatch])

  const carMaxAge = carBrand ? cars[carBrand]?.maxCarAge ?? 0 : 0
  const durationMaxFromCarAge = carYear
    ? (carMaxAge - (new Date().getFullYear() - carYear)) * MONTH_OF_YEAR_COUNT
    : 0

  const durationMaxFromClientAge = useMemo(() => {
    const clientAge = birthDate
      ? Math.ceil(
          Interval.fromDateTimes(DateTime.fromJSDate(new Date(birthDate)), DateTime.now()).toDuration('years')
            .years,
        )
      : !isFilledElementaryClientData
      ? MIN_AGE
      : undefined

    return clientAge ? (MAX_AGE - clientAge) * MONTH_OF_YEAR_COUNT : 0
  }, [birthDate, isFilledElementaryClientData])

  const durationMaxFromAge = Math.min(durationMaxFromCarAge, durationMaxFromClientAge)

  const { creditProducts, isValidCreditProduct } = useMemo(
    () =>
      (data?.products || []).reduce(
        (acc, cur) => {
          if (cur.durationMin && cur.durationMin > durationMaxFromAge) {
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
    [creditProduct, data?.products, durationMaxFromAge],
  )
  const currentProduct = useMemo(() => data?.productsMap?.[creditProduct], [creditProduct, data?.productsMap])
  // Если creditProduct пришел с Бэка, но по какой-то причине не проходит по сроку, то очищаем поле
  useEffect(() => {
    if (data?.products && !isValidCreditProduct && creditProduct) {
      setCreditProduct('')
    }
    // Исключили setCreditProduct что бы избежать случайного перерендера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditProduct, currentProduct])

  const onlyCreditAdditionalEquipmentsCost = getServicesTotalCost(additionalEquipments, true)
  const minInitialPaymentPercent = currentProduct?.downpaymentMin || data?.fullDownpaymentMin
  const maxInitialPaymentPercent = currentProduct?.downpaymentMax || data?.fullDownpaymentMax
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
  /*
  Сформирован на основе минимального и максимального срока кредита
  массив допустимых значений для поля Срок кредита. Просто возвращается компоненту.
  */
  const loanTerms = useMemo(() => {
    const durationMin =
      Math.ceil((currentProduct?.durationMin || data?.fullDurationMin || 0) / LOAN_TERM_GRADUATION_VALUE) *
      LOAN_TERM_GRADUATION_VALUE
    const durationMaxFromProduct =
      Math.floor((currentProduct?.durationMax || data?.fullDurationMax || 0) / LOAN_TERM_GRADUATION_VALUE) *
      LOAN_TERM_GRADUATION_VALUE

    const durationMax = Math.min(durationMaxFromProduct, durationMaxFromAge)
    if (durationMin > durationMax || durationMax <= 0) {
      return []
    }
    const scaleLength = (durationMax - durationMin) / LOAN_TERM_GRADUATION_VALUE + 1
    const loanTerms = [...new Array(scaleLength)].map((v, i) => ({
      value: (i + 1) * LOAN_TERM_GRADUATION_VALUE + durationMin - LOAN_TERM_GRADUATION_VALUE,
    }))

    return loanTerms
  }, [
    currentProduct?.durationMax,
    currentProduct?.durationMin,
    data?.fullDurationMax,
    data?.fullDurationMin,
    durationMaxFromAge,
  ])

  /* Если loanTerm пришел с Бэка, но по какой-то причине не входит в диапазон допустимых сроков,
  то очищаем поле */
  useEffect(() => {
    if (!!loanTerm && loanTerms.length && !loanTerms.some(term => term.value === loanTerm)) {
      setLoanTerm('')
    }
    // Исключили setLoanTerm что бы избежать случайного перерендера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditProduct, currentProduct])

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

  // То же для ПВ в абсолютных единицах
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

  const additionalEquipmentsCost = getServicesTotalCost(additionalEquipments)
  const bankAdditionalServicesCost = getServicesTotalCost(bankAdditionalServices)
  const dealerAdditionalServicesCost = getServicesTotalCost(dealerAdditionalServices)

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
  const isLoadedCreditProducts = !isLoading && isSuccess

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

  const isHasCasco = dealerAdditionalServices.some(e => e.productType === OptionID.CASCO)

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
      additionalEquipments.forEach((e, i) =>
        setFieldTouched(`${ServicesGroupName.additionalEquipments}.${i}.${FormFieldNameMap.productCost}`),
      )
    }
    if (commonErrorsField.value.isExceededDealerAdditionalServicesLimit) {
      dealerAdditionalServices.forEach((e, i) =>
        setFieldTouched(`${ServicesGroupName.dealerAdditionalServices}.${i}.${FormFieldNameMap.productCost}`),
      )
    }
    if (commonErrorsField.value.isExceededBankAdditionalServicesLimit) {
      bankAdditionalServices.forEach((e, i) =>
        setFieldTouched(`${ServicesGroupName.bankAdditionalServices}.${i}.${FormFieldNameMap.productCost}`),
      )
    }
    // Исключили additionalEquipments, bankAdditionalServices, dealerAdditionalServices
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
    isLoadedCreditProducts,
  }
}
