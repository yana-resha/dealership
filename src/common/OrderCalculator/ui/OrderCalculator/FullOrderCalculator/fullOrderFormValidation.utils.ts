import * as Yup from 'yup'

import { CAR_PASSPORT_TYPE, CASCO_OPTION_ID } from 'common/OrderCalculator/config'
import { FormFieldNameMap } from 'common/OrderCalculator/types'
import {
  additionalServiceBaseValidation,
  bankAdditionalServiceBaseValidation,
  baseFormValidation,
  checkAdditionalEquipmentsLimit,
  checkBankAdditionalServicesLimit,
  checkDealerAdditionalServicesLimit,
  checkIsLowCascoLimit,
  setRequiredIfNecessaryCasco,
} from 'common/OrderCalculator/utils/baseFormValidation'
import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { FieldMessages } from 'shared/constants/fieldMessages'

import {
  bankDetailsFormValidation,
  requiredBankDetailsFormValidation,
  setRequiredIfHasProductType,
  setRequiredIfInCredit,
} from './FormContainer/BankDetails/bankDetailsFormValidation.utils'

function checkForCarCreationDate(value: Date | null | undefined, context: Yup.TestContext) {
  const carYear = context.parent[FormFieldNameMap.carYear] as string | undefined
  if (!value || !carYear) {
    return true
  }

  return parseInt(carYear, 10) <= value.getFullYear()
}

export const fullOrderFormValidationSchema = Yup.object().shape({
  ...baseFormValidation,

  [FormFieldNameMap.carPassportType]: Yup.number().nullable().required(FieldMessages.required),
  [FormFieldNameMap.carPassportId]: Yup.string()
    .required(FieldMessages.required)
    .when([FormFieldNameMap.carPassportType], {
      is: (carPassportType: number) => carPassportType === CAR_PASSPORT_TYPE[0].value,
      then: schema => schema.min(15, FieldMessages.enterFullData),
      otherwise: schema => schema.min(10, FieldMessages.enterFullData),
    }),
  [FormFieldNameMap.carPassportCreationDate]: Yup.date()
    .nullable()
    .required(FieldMessages.required)
    .test('', 'Дата выдачи ПТС не может превышать дату выпуска автомобиля', checkForCarCreationDate),

  [FormFieldNameMap.carIdType]: Yup.string().nullable().required(FieldMessages.required),
  [FormFieldNameMap.carId]: Yup.string()
    .required(FieldMessages.required)
    .min(17, FieldMessages.enterFullData),
  [FormFieldNameMap.salesContractId]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.salesContractDate]: Yup.date()
    .nullable()
    .required(FieldMessages.required)
    .test('', 'Дата ДКП не может превышать дату выпуска автомобиля', checkForCarCreationDate),
  [FormFieldNameMap.legalPersonCode]: Yup.string().required(FieldMessages.required),

  ...requiredBankDetailsFormValidation,

  [ServicesGroupName.additionalEquipments]: Yup.array().of(
    Yup.object().shape({
      ...additionalServiceBaseValidation(checkAdditionalEquipmentsLimit),

      [FormFieldNameMap.documentType]: setRequiredIfInCredit(
        Yup.number()
          .nullable()
          .test('', FieldMessages.required, (value: number | null | undefined) => value !== 0),
      ),
      [FormFieldNameMap.documentNumber]: setRequiredIfInCredit(Yup.string().nullable()),
      [FormFieldNameMap.documentDate]: setRequiredIfInCredit(Yup.string().nullable()),
      [FormFieldNameMap.broker]: setRequiredIfInCredit(Yup.string().nullable()),

      ...bankDetailsFormValidation,
    }),
  ),

  [ServicesGroupName.dealerAdditionalServices]: Yup.array().of(
    Yup.object().shape({
      ...additionalServiceBaseValidation(checkDealerAdditionalServicesLimit),

      [FormFieldNameMap.documentType]: setRequiredIfNecessaryCasco(
        setRequiredIfInCredit(
          Yup.number()
            .nullable()
            .test('', FieldMessages.required, (value: number | null | undefined) => value !== 0),
        ),
      ),
      [FormFieldNameMap.documentNumber]: setRequiredIfNecessaryCasco(setRequiredIfInCredit(Yup.string())),
      [FormFieldNameMap.documentDate]: setRequiredIfNecessaryCasco(
        setRequiredIfInCredit(Yup.string().nullable()),
      ),
      [FormFieldNameMap.provider]: setRequiredIfInCredit(
        Yup.string().when([FormFieldNameMap.productType], {
          is: (productType: string) => productType === CASCO_OPTION_ID,
          then: schema => schema.required(FieldMessages.required),
        }),
      ),
      [FormFieldNameMap.broker]: setRequiredIfInCredit(Yup.string().nullable()),
      [FormFieldNameMap.loanTerm]: setRequiredIfNecessaryCasco(
        setRequiredIfInCredit(Yup.number().nullable()),
      ),

      ...bankDetailsFormValidation,

      [FormFieldNameMap.cascoLimit]: checkIsLowCascoLimit(Yup.string()),
    }),
  ),

  [ServicesGroupName.bankAdditionalServices]: Yup.array().of(
    Yup.object().shape({
      ...bankAdditionalServiceBaseValidation(checkBankAdditionalServicesLimit),
      [FormFieldNameMap.provider]: setRequiredIfHasProductType(Yup.string().nullable()),
    }),
  ),
})
