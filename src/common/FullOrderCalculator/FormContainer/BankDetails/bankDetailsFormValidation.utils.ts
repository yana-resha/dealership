import * as Yup from 'yup'

import { FormFieldNameMap } from 'entities/orderCalculator'
import { FieldMessages } from 'shared/constatnts/fieldMessages'

export const bankDetailsFormValidation = {
  [FormFieldNameMap.bankIdentificationCode]: Yup.string()
    .when([FormFieldNameMap.productType], {
      is: (productType: string) => !!productType,
      then: schema => schema.required(FieldMessages.required),
    })
    .when([FormFieldNameMap.productType, FormFieldNameMap.isCustomFields], {
      is: (productType: string, isCustomFields: boolean) => !!productType && isCustomFields,
      then: schema => schema.min(9, FieldMessages.enterFullData),
    }),
  [FormFieldNameMap.beneficiaryBank]: Yup.string().when([FormFieldNameMap.productType], {
    is: (productType: string) => !!productType,
    then: schema => schema.required(FieldMessages.required),
  }),
  [FormFieldNameMap.bankAccountNumber]: Yup.string()
    .when([FormFieldNameMap.productType], {
      is: (productType: string) => !!productType,
      then: schema => schema.required(FieldMessages.required),
    })
    .when([FormFieldNameMap.productType, FormFieldNameMap.isCustomFields], {
      is: (productType: string, isCustomFields: boolean) => !!productType && isCustomFields,
      then: schema => schema.min(20, FieldMessages.enterFullData),
    }),
  [FormFieldNameMap.correspondentAccount]: Yup.string().when(
    [FormFieldNameMap.productType, FormFieldNameMap.isCustomFields],
    {
      is: (productType: string, isCustomFields: boolean) => !!productType && isCustomFields,
      then: schema => schema.required(FieldMessages.required).min(20, FieldMessages.enterFullData),
    },
  ),
}

export const requiredBankDetailsFormValidation = {
  [FormFieldNameMap.bankIdentificationCode]: Yup.string()
    .required(FieldMessages.required)
    .when([FormFieldNameMap.isCustomFields], {
      is: (isCustomFields: boolean) => isCustomFields,
      then: schema => schema.min(9, FieldMessages.enterFullData),
    }),
  [FormFieldNameMap.beneficiaryBank]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.bankAccountNumber]: Yup.string()
    .required(FieldMessages.required)
    .when([FormFieldNameMap.isCustomFields], {
      is: (isCustomFields: boolean) => isCustomFields,
      then: schema => schema.min(20, FieldMessages.enterFullData),
    }),
  [FormFieldNameMap.correspondentAccount]: Yup.string().when([FormFieldNameMap.isCustomFields], {
    is: (isCustomFields: boolean) => isCustomFields,
    then: schema => schema.required(FieldMessages.required).min(20, FieldMessages.enterFullData),
  }),
}
