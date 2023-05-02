import * as Yup from 'yup'

import { CAR_CONDITIONS, FormFieldNameMap } from '../OrderCalculator.config'

const REQUIRED_FIELD_MESSAGE = 'Поле обязательно для заполнения'

export const orderСalculatorFormValidationSchema = Yup.object().shape({
  [FormFieldNameMap.carCondition]: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  [FormFieldNameMap.carBrand]: Yup.string().nullable().required(REQUIRED_FIELD_MESSAGE),
  [FormFieldNameMap.carModel]: Yup.string().nullable().required(REQUIRED_FIELD_MESSAGE),
  [FormFieldNameMap.carYear]: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  [FormFieldNameMap.carCost]: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  [FormFieldNameMap.carMileage]: Yup.string().when([FormFieldNameMap.carCondition], {
    is: (carCondition: string) => carCondition === CAR_CONDITIONS[1],
    then: schema => schema.required(REQUIRED_FIELD_MESSAGE),
  }),
  [FormFieldNameMap.initialPayment]: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  [FormFieldNameMap.loanTerm]: Yup.string().required(REQUIRED_FIELD_MESSAGE),
})
