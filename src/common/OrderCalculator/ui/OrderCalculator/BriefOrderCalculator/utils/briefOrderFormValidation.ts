import * as Yup from 'yup'

import { FormFieldNameMap } from 'common/OrderCalculator/types'
import {
  additionalServiceBaseValidation,
  bankAdditionalServiceBaseValidation,
  baseFormValidation,
  checkAdditionalEquipmentsLimit,
  checkBankAdditionalServicesLimit,
  checkDealerAdditionalServicesLimit,
  checkIsLowCascoLimit,
} from 'common/OrderCalculator/utils/baseFormValidation'
import { ServicesGroupName } from 'entities/applications/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'

export const briefOrderFormValidationSchema = Yup.object({
  ...baseFormValidation,

  [ServicesGroupName.additionalEquipments]: Yup.array().of(
    Yup.object().shape({
      ...additionalServiceBaseValidation(checkAdditionalEquipmentsLimit),
    }),
  ),
  [ServicesGroupName.dealerAdditionalServices]: Yup.array().of(
    Yup.object().shape({
      ...additionalServiceBaseValidation(checkDealerAdditionalServicesLimit),
      [FormFieldNameMap.cascoLimit]: checkIsLowCascoLimit(Yup.string()),
    }),
  ),
  [ServicesGroupName.bankAdditionalServices]: Yup.array().of(
    Yup.object().shape({
      ...bankAdditionalServiceBaseValidation(checkBankAdditionalServicesLimit),
    }),
  ),
})
