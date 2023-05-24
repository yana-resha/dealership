import * as Yup from 'yup'

import {
  FormFieldNameMap,
  baseFormValidation,
  additionalServiceBaseValidation,
  CAR_PASSPORT_TYPE,
} from 'entities/OrderCalculator'
import { FieldMessages } from 'shared/constants/fieldMessages'

import {
  bankDetailsFormValidation,
  requiredBankDetailsFormValidation,
} from './FormContainer/BankDetails/bankDetailsFormValidation.utils'

function checkForCarCreationDate(value: Date | undefined, context: Yup.TestContext) {
  const carYear = context.parent[FormFieldNameMap.carYear] as string | undefined
  if (!value || !carYear) {
    return true
  }

  return parseInt(carYear, 10) <= value.getFullYear()
}

export const fullOrderFormValidationSchema = Yup.object().shape({
  ...baseFormValidation,

  [FormFieldNameMap.carPassportType]: Yup.number().required(FieldMessages.required),
  [FormFieldNameMap.carPassportId]: Yup.string()
    .required(FieldMessages.required)
    .when([FormFieldNameMap.carPassportType], {
      is: (carPassportType: number) => carPassportType === CAR_PASSPORT_TYPE[0].value,
      then: schema => schema.min(15, FieldMessages.enterFullData),
      otherwise: schema => schema.min(10, FieldMessages.enterFullData),
    }),
  [FormFieldNameMap.carPassportCreationDate]: Yup.date()
    .required(FieldMessages.required)
    .test('', 'Дата выдачи ПТС не может превышать дату выпуска автомобиля', checkForCarCreationDate),

  [FormFieldNameMap.carIdType]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.carId]: Yup.string()
    .required(FieldMessages.required)
    .min(17, FieldMessages.enterFullData),
  [FormFieldNameMap.salesContractId]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.salesContractDate]: Yup.date()
    .required(FieldMessages.required)
    .test('', 'Дата ДКП не может превышать дату выпуска автомобиля', checkForCarCreationDate),
  [FormFieldNameMap.legalPerson]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.loanAmount]: Yup.string().required(FieldMessages.required),

  ...requiredBankDetailsFormValidation,

  [FormFieldNameMap.additionalEquipments]: Yup.array().of(
    Yup.object().shape({
      ...additionalServiceBaseValidation,
      [FormFieldNameMap.legalPerson]: Yup.string().when([FormFieldNameMap.productType], {
        is: (productType: string) => !!productType,
        then: schema => schema.required(FieldMessages.required),
      }),
      ...bankDetailsFormValidation,
    }),
  ),

  [FormFieldNameMap.dealerAdditionalServices]: Yup.array().of(
    Yup.object().shape({
      ...additionalServiceBaseValidation,
      [FormFieldNameMap.provider]: Yup.string().when([FormFieldNameMap.productType], {
        is: (productType: string) => !!productType,
        then: schema => schema.required(FieldMessages.required),
      }),
      [FormFieldNameMap.agent]: Yup.string().when([FormFieldNameMap.productType], {
        is: (productType: string) => !!productType,
        then: schema => schema.required(FieldMessages.required),
      }),
      [FormFieldNameMap.loanTerm]: Yup.string().when(
        [FormFieldNameMap.productType, FormFieldNameMap.isCreditAdditionalService],
        {
          is: (productType: string, isCreditAdditionalService: boolean) =>
            !!productType && isCreditAdditionalService,
          then: schema => schema.required(FieldMessages.required),
        },
      ),
      [FormFieldNameMap.documentId]: Yup.string().when(
        [FormFieldNameMap.productType, FormFieldNameMap.isCreditAdditionalService],
        {
          is: (productType: string, isCreditAdditionalService: boolean) =>
            !!productType && isCreditAdditionalService,
          then: schema => schema.required(FieldMessages.required),
        },
      ),
      ...bankDetailsFormValidation,
    }),
  ),
})
