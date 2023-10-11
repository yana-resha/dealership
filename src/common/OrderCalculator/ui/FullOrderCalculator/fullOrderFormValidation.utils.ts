import { OptionID } from '@sberauto/dictionarydc-proto/public'
import * as Yup from 'yup'
import { AnyObject, InternalOptions } from 'yup/lib/types'

import { CAR_PASSPORT_TYPE } from 'common/OrderCalculator/config'
import { FormFieldNameMap } from 'common/OrderCalculator/types'
import {
  additionalServiceBaseValidation,
  baseFormValidation,
  checkAdditionalEquipmentsLimit,
  checkDealerAdditionalServicesLimit,
} from 'common/OrderCalculator/utils/baseFormValidation'
import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/hooks/useAdditionalServicesOptions'
import { FieldMessages } from 'shared/constants/fieldMessages'

import {
  bankDetailsFormValidation,
  requiredBankDetailsFormValidation,
  setRequiredIfInCredit,
} from './FormContainer/BankDetails/bankDetailsFormValidation.utils'

function checkForCarCreationDate(value: Date | null | undefined, context: Yup.TestContext) {
  const carYear = context.parent[FormFieldNameMap.carYear] as string | undefined
  if (!value || !carYear) {
    return true
  }

  return parseInt(carYear, 10) <= value.getFullYear()
}

type YupBaseSchema<T> = Yup.BaseSchema<T, AnyObject, T>
export function setRequiredIfNecessaryCasco<T extends YupBaseSchema<string | number | undefined | null>>(
  schema: T,
  message?: string,
) {
  return schema.when([FormFieldNameMap.productType], {
    is: (productType: string) => productType === `${OptionID.CASCO}`,
    then: schema =>
      schema.test(
        'isHasNotCascoLimit',
        message || FieldMessages.required,
        (value, context) =>
          !(context.options as InternalOptions)?.from?.[1].value.validationParams.isNecessaryCasco || !!value,
      ),
  })
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
  [FormFieldNameMap.legalPerson]: Yup.string().required(FieldMessages.required),

  ...requiredBankDetailsFormValidation,

  [ServicesGroupName.additionalEquipments]: Yup.array().of(
    Yup.object().shape({
      ...additionalServiceBaseValidation(checkAdditionalEquipmentsLimit),

      [FormFieldNameMap.documentType]: setRequiredIfInCredit(Yup.string().nullable()),
      [FormFieldNameMap.documentNumber]: setRequiredIfInCredit(Yup.string()),
      [FormFieldNameMap.documentDate]: setRequiredIfInCredit(Yup.string().nullable()),
      [FormFieldNameMap.legalPerson]: setRequiredIfInCredit(Yup.string()),

      ...bankDetailsFormValidation,
    }),
  ),

  [ServicesGroupName.dealerAdditionalServices]: Yup.array().of(
    Yup.object().shape({
      ...additionalServiceBaseValidation(checkDealerAdditionalServicesLimit),

      [FormFieldNameMap.documentType]: setRequiredIfNecessaryCasco(
        setRequiredIfInCredit(Yup.string().nullable()),
      ),
      [FormFieldNameMap.documentNumber]: setRequiredIfNecessaryCasco(setRequiredIfInCredit(Yup.string())),
      [FormFieldNameMap.documentDate]: setRequiredIfNecessaryCasco(
        setRequiredIfInCredit(Yup.string().nullable()),
      ),
      [FormFieldNameMap.provider]: setRequiredIfNecessaryCasco(Yup.string()),
      [FormFieldNameMap.agent]: setRequiredIfInCredit(Yup.string()),
      [FormFieldNameMap.loanTerm]: setRequiredIfNecessaryCasco(setRequiredIfInCredit(Yup.number())),

      ...bankDetailsFormValidation,

      [FormFieldNameMap.cascoLimit]: setRequiredIfNecessaryCasco(Yup.string()),
    }),
  ),
})
