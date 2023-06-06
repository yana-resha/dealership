import * as Yup from 'yup'

import {
  additionalServiceBaseValidation,
  baseFormValidation,
  checkAdditionalEquipmentsLimit,
  checkBankAdditionalServicesLimit,
  checkDealerAdditionalServicesLimit,
} from 'common/OrderCalculator/utils/baseFormValidation'
import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'

export const orderFormValidationSchema = Yup.object({
  ...baseFormValidation,

  [ServicesGroupName.additionalEquipments]: Yup.array().of(
    Yup.object().shape({
      ...additionalServiceBaseValidation(checkAdditionalEquipmentsLimit),
    }),
  ),
  [ServicesGroupName.dealerAdditionalServices]: Yup.array().of(
    Yup.object().shape({
      ...additionalServiceBaseValidation(checkDealerAdditionalServicesLimit),
    }),
  ),
  [ServicesGroupName.bankAdditionalServices]: Yup.array().of(
    Yup.object().shape({
      ...additionalServiceBaseValidation(checkBankAdditionalServicesLimit),
    }),
  ),
})
