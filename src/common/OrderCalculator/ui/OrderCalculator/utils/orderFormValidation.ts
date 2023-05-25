import * as Yup from 'yup'

import { FormFieldNameMap } from 'common/OrderCalculator/types'
import {
  additionalServiceBaseValidation,
  baseFormValidation,
  checkAdditionalEquipmentsLimit,
  checkBankAdditionalServicesLimit,
  checkDealerAdditionalServicesLimit,
} from 'common/OrderCalculator/utils/baseFormValidation'

export const orderFormValidationSchema = Yup.object({
  ...baseFormValidation,

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
