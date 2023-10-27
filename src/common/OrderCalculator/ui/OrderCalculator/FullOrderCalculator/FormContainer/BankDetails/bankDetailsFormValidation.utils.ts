import { OptionID } from '@sberauto/dictionarydc-proto/public'
import * as Yup from 'yup'
import { AnyObject } from 'yup/lib/types'

import { FormFieldNameMap } from 'common/OrderCalculator/types'
import { FieldMessages } from 'shared/constants/fieldMessages'

export function setRequiredIfHasProductType<T extends Yup.BaseSchema<any, AnyObject, any>>(
  schema: T,
  message?: string,
) {
  return schema.when([FormFieldNameMap.productType], {
    is: (productType: string) => !!productType,
    then: schema => schema.required(message || FieldMessages.required),
  })
}

export function setRequiredIfInCredit<T extends Yup.BaseSchema<any, AnyObject, any>>(
  schema: T,
  message?: string,
) {
  return schema.when([FormFieldNameMap.isCredit], {
    is: true,
    then: schema => setRequiredIfHasProductType(schema, message),
  })
}

export const bankDetailsFormValidation = {
  [FormFieldNameMap.bankIdentificationCode]: setRequiredIfInCredit(Yup.string()).when(
    [FormFieldNameMap.productType, FormFieldNameMap.isCustomFields],
    {
      is: (productType: string, isCustomFields: boolean) => !!productType && isCustomFields,
      then: schema => schema.min(9, FieldMessages.enterFullData),
    },
  ),
  [FormFieldNameMap.beneficiaryBank]: setRequiredIfInCredit(Yup.string()),
  [FormFieldNameMap.bankAccountNumber]: setRequiredIfInCredit(Yup.string()).when(
    [FormFieldNameMap.productType, FormFieldNameMap.isCustomFields],
    {
      is: (productType: string, isCustomFields: boolean) => !!productType && isCustomFields,
      then: schema => schema.min(20, FieldMessages.enterFullData),
    },
  ),
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
