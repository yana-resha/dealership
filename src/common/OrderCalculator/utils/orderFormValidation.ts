import * as Yup from 'yup'

import { FormFieldNameMap, CAR_CONDITIONS } from 'entities/orderCalculator'
import { FieldMessages } from 'shared/constatnts/fieldMessages'

export const orderСalculatorFormValidationSchema = Yup.object().shape({
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
})
