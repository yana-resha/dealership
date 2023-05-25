import * as Yup from 'yup'

import { FormFieldNameMap } from 'entities/OrderCalculator'
import {
  ValidationParams,
  additionalServiceBaseValidation,
  baseFormValidationFn,
  checkAdditionalEquipmentsLimit,
  checkBankAdditionalServicesLimit,
  checkDealerAdditionalServicesLimit,
} from 'entities/OrderCalculator/utils/baseFormValidation'

// TODO DCB-272 Переименовать (удалить Fn) после интеграции большого калькулятора
export const orderFormValidationSchema = ({
  minPercent,
  maxPercent,
  minInitialPayment,
  maxInitialPayment,
}: ValidationParams) =>
  Yup.object({
    ...baseFormValidationFn({ minPercent, maxPercent, minInitialPayment, maxInitialPayment }),

    [FormFieldNameMap.additionalEquipments]: Yup.array().of(
      Yup.object().shape({
        ...additionalServiceBaseValidation(checkAdditionalEquipmentsLimit),
      }),
    ),
    [FormFieldNameMap.dealerAdditionalServices]: Yup.array().of(
      Yup.object().shape({
        ...additionalServiceBaseValidation(checkDealerAdditionalServicesLimit),
      }),
    ),
    [FormFieldNameMap.bankAdditionalServices]: Yup.array().of(
      Yup.object().shape({
        ...additionalServiceBaseValidation(checkBankAdditionalServicesLimit),
      }),
    ),
  })
