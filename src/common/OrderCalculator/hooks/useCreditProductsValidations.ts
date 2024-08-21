import { useEffect, useMemo } from 'react'

import { useField, useFormikContext } from 'formik'

import { ServicesGroupName } from 'entities/applications/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { stringToNumber } from 'shared/utils/stringToNumber'

import { CASCO_OPTION_ID, formMessages } from '../config'
import {
  BriefOrderCalculatorFields,
  CommonError,
  FormFieldNameMap,
  FormMessages,
  OrderCalculatorAdditionalService,
  OrderCalculatorBankAdditionalService,
  ValidationParams,
} from '../types'

const ADDITIONAL_EQUIPMENT_FROM_CAR_COST_SETPOINT = 0.3
const DEALER_ADDITIONAL_SERVICES_FROM_CAR_COST_SETPOINT = 0.45
const BANK_ADDITIONAL_SERVICES_FROM_CAR_COST_SETPOINT = 0.3
const ALL_ADDITIONAL_SERVICES_FROM_CAR_COST_SETPOINT = 0.45

export function getServicesTotalCost(
  services: (OrderCalculatorAdditionalService | OrderCalculatorBankAdditionalService)[],
  onlyCredit = false,
  isBankServices = false,
) {
  return services.reduce((acc, cur) => {
    const isCredit = isBankServices ? true : (cur as OrderCalculatorAdditionalService).isCredit
    if (typeof cur.productType !== 'string' || !cur.productCost || (onlyCredit && !isCredit)) {
      return acc
    }
    const productCost = stringToNumber(cur.productCost)

    return acc + (productCost ?? 0)
  }, 0)
}

export function checkIfExceededServicesLimit(carCost: number, criterion: boolean) {
  if (Number.isNaN(carCost)) {
    return false
  }

  return criterion
}
type Params = {
  minInitialPaymentPercent: number
  maxInitialPaymentPercent: number
  minInitialPayment: number
  maxInitialPayment: number
}
export function useCreditProductsValidations({
  minInitialPayment,
  maxInitialPayment,
  minInitialPaymentPercent,
  maxInitialPaymentPercent,
}: Params) {
  const [validationParamsField, , { setValue: setValidationParams }] = useField<ValidationParams>(
    FormFieldNameMap.validationParams,
  )
  const [commonErrorsField, , { setValue: setCommonErrors }] = useField<CommonError>(
    FormFieldNameMap.commonError,
  )
  const { values, setFieldTouched } = useFormikContext<BriefOrderCalculatorFields>()
  const { bankAdditionalServices, dealerAdditionalServices, additionalEquipments } = values
  const carCost = parseFloat(values.carCost)

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
  const dealerAdditionalServicesCost = getServicesTotalCost(dealerAdditionalServices)
  const bankAdditionalServicesCost = getServicesTotalCost(bankAdditionalServices, false, true)

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

  // TODO DCB-2027 Удалить логику по обязательности КАСКО
  const isNecessaryCasco = false
  /*
  В initialValues формика прописано свойство validationParams. Поля для него нет,
  оно служит для передачи внешних данных (isNecessaryCasco...) в схему валидации.
  В данном эффекте это и производится, если значение изменилось
  */
  useEffect(() => {
    if (validationParamsField.value.isNecessaryCasco !== isNecessaryCasco) {
      setValidationParams({
        ...validationParamsField.value,
        isNecessaryCasco: isNecessaryCasco,
      })
    }
    // Исключили setValidationParams что бы избежать случайного перерендера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNecessaryCasco, validationParamsField.value])

  const isHasCasco = dealerAdditionalServices.some(e => e.productType === CASCO_OPTION_ID)

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
  }, [commonErrorsField.value, isNecessaryCasco, isHasCasco])

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
    commonErrors,
    isNecessaryCasco,
    values,
  }
}
