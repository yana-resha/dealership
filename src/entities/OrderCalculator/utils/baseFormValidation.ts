import * as Yup from 'yup'

import { FieldMessages } from 'shared/constants/fieldMessages'

import { CAR_CONDITIONS, CommonError, FormFieldNameMap } from '../config'

export function checkAdditionalEquipmentsLimit(commonError: CommonError) {
  return !commonError.isExceededServicesTotalLimit && !commonError.isExceededAdditionalEquipmentsLimit
}
export function checkDealerAdditionalServicesLimit(commonError: CommonError) {
  return !commonError.isExceededServicesTotalLimit && !commonError.isExceededDealerAdditionalServicesLimit
}
export function checkBankAdditionalServicesLimit(commonError: CommonError) {
  return !commonError.isExceededServicesTotalLimit && !commonError.isExceededBankAdditionalServicesLimit
}

export const additionalServiceBaseValidation = (checkFn: (commonError: CommonError) => void) => ({
  [FormFieldNameMap.productType]: Yup.string(),
  [FormFieldNameMap.productCost]: Yup.string()
    .when([FormFieldNameMap.productType], {
      is: (productType: string) => !!productType,
      then: schema => schema.required(FieldMessages.required),
    })
    .when([FormFieldNameMap.productType], {
      is: (productType: string) => !!productType,
      then: schema =>
        schema.test(
          'isExceededLimit',
          () => '',
          // @ts-ignore
          (value, context) => checkFn(context.from[1].value.commonError),
        ),
    }),
})
// TODO DCB-272 Удалить после интеграции большого калькулятора, т.к. ему тоже будет нужна только функция ниже
export const baseFormValidation = {
  [FormFieldNameMap.carCondition]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.carBrand]: Yup.string().nullable().required(FieldMessages.required),
  [FormFieldNameMap.carModel]: Yup.string().nullable().required(FieldMessages.required),
  [FormFieldNameMap.carYear]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.carCost]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.carMileage]: Yup.string().when([FormFieldNameMap.carCondition], {
    is: (carCondition: string) => !carCondition,
    then: schema => schema.required(FieldMessages.required),
  }),
  [FormFieldNameMap.initialPayment]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.loanTerm]: Yup.string().required(FieldMessages.required),
}

export type ValidationParams = {
  minPercent?: number
  maxPercent?: number
  minInitialPayment?: number
  maxInitialPayment?: number
}
// TODO DCB-272 Переименовать (удалить Fn) после интеграции большого калькулятора
export const baseFormValidationFn = ({
  minPercent,
  maxPercent,
  minInitialPayment,
  maxInitialPayment,
}: ValidationParams) => ({
  [FormFieldNameMap.carCondition]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.carBrand]: Yup.string().nullable().required(FieldMessages.required),
  [FormFieldNameMap.carModel]: Yup.string().nullable().required(FieldMessages.required),
  [FormFieldNameMap.carYear]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.carCost]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.carMileage]: Yup.string().when([FormFieldNameMap.carCondition], {
    is: (carCondition: string) => !carCondition,
    then: schema => schema.required(FieldMessages.required),
  }),
  [FormFieldNameMap.initialPayment]: Yup.string()
    .required(FieldMessages.required)
    .test(
      'isMoreThenMin',
      () => `Значение должно быть больше ${minInitialPayment}`,
      value => !value || !minInitialPayment || parseInt(value, 10) >= minInitialPayment,
    )
    .test(
      'isLessThenMax',
      () => `Значение должно быть меньше ${maxInitialPayment}`,
      value => !value || !maxInitialPayment || parseInt(value, 10) <= maxInitialPayment,
    ),
  [FormFieldNameMap.initialPaymentPercent]: Yup.string()
    .test(
      'isMoreThenMin',
      () => `Значение должно быть больше ${minPercent}`,
      value => !value || !minPercent || parseFloat(value) >= minPercent,
    )
    .test(
      'isLessThenMax',
      () => `Значение должно быть меньше ${maxPercent}`,
      value => !value || !maxPercent || parseFloat(value) <= maxPercent,
    ),
  [FormFieldNameMap.loanTerm]: Yup.string().required(FieldMessages.required),
})
