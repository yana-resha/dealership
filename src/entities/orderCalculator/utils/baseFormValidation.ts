import * as Yup from 'yup'

import { FieldMessages } from 'shared/constatnts/fieldMessages'

import { CAR_CONDITIONS, FormFieldNameMap } from '../config'

export const additionalServiceBaseValidation = {
  [FormFieldNameMap.productType]: Yup.string(),
  [FormFieldNameMap.productCost]: Yup.string().when([FormFieldNameMap.productType], {
    is: (productType: string) => !!productType,
    then: schema => schema.required(FieldMessages.required),
  }),
  [FormFieldNameMap.isCreditAdditionalService]: Yup.string().when([FormFieldNameMap.productType], {
    is: (productType: string) => !!productType,
    then: schema => schema.required(FieldMessages.required),
  }),
}

export const baseFormValidation = {
  [FormFieldNameMap.carCondition]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.carBrand]: Yup.string().nullable().required(FieldMessages.required),
  [FormFieldNameMap.carModel]: Yup.string().nullable().required(FieldMessages.required),
  [FormFieldNameMap.carYear]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.carCost]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.carMileage]: Yup.string().when([FormFieldNameMap.carCondition], {
    is: (carCondition: string) => carCondition === CAR_CONDITIONS[1],
    then: schema => schema.required(FieldMessages.required),
  }),
  [FormFieldNameMap.initialPayment]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.loanTerm]: Yup.string().required(FieldMessages.required),
}
