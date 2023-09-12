import * as Yup from 'yup'
import { InternalOptions } from 'yup/lib/types'

import { FieldMessages } from 'shared/constants/fieldMessages'

import { CommonError, FormFieldNameMap } from '../types'

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
  [FormFieldNameMap.productType]: Yup.string().nullable(),
  [FormFieldNameMap.productCost]: Yup.string().when([FormFieldNameMap.productType], {
    is: (productType: string) => !!productType,
    then: schema =>
      schema.required(FieldMessages.required).test(
        'isExceededLimit',
        '',
        // @ts-ignore
        (value, context) => checkFn(context.from[1].value.commonError),
      ),
  }),
})

export const baseFormValidation = {
  [FormFieldNameMap.carCondition]: Yup.number().required(FieldMessages.required),
  [FormFieldNameMap.carBrand]: Yup.string().nullable().required(FieldMessages.required),
  [FormFieldNameMap.carModel]: Yup.string().nullable().required(FieldMessages.required),
  [FormFieldNameMap.carYear]: Yup.number().nullable().required(FieldMessages.required),
  [FormFieldNameMap.carCost]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.carMileage]: Yup.string().when([FormFieldNameMap.carCondition], {
    is: (carCondition: number) => !carCondition,
    then: schema => schema.required(FieldMessages.required),
  }),
  [FormFieldNameMap.initialPayment]: Yup.string()
    .required(FieldMessages.required)
    .test('isLessThenMin', (value, context) => {
      const { minInitialPayment } =
        (context.options as InternalOptions)?.from?.[0].value.validationParams || {}

      return value && minInitialPayment && parseInt(value, 10) < minInitialPayment
        ? context.createError({ message: `Значение должно быть больше ${minInitialPayment}` })
        : true
    })
    .test('isMoreThenMax', (value, context) => {
      const { maxInitialPayment } =
        (context.options as InternalOptions)?.from?.[0].value.validationParams || {}

      return value && maxInitialPayment && parseInt(value, 10) > maxInitialPayment
        ? context.createError({ message: `Значение должно быть меньше ${maxInitialPayment}` })
        : true
    }),

  [FormFieldNameMap.initialPaymentPercent]: Yup.string()
    .test('isLessThenMin', (value, context) => {
      const { minInitialPaymentPercent } =
        (context.options as InternalOptions)?.from?.[0].value.validationParams || {}

      return value && minInitialPaymentPercent && parseInt(value, 10) < minInitialPaymentPercent
        ? context.createError({ message: `Значение должно быть больше ${minInitialPaymentPercent}` })
        : true
    })
    .test('isMoreThenMax', (value, context) => {
      const { maxInitialPaymentPercent } =
        (context.options as InternalOptions)?.from?.[0].value.validationParams || {}

      return value && maxInitialPaymentPercent && parseInt(value, 10) > maxInitialPaymentPercent
        ? context.createError({ message: `Значение должно быть меньше ${maxInitialPaymentPercent}` })
        : true
    }),
  [FormFieldNameMap.loanTerm]: Yup.number().required(FieldMessages.required),
  [FormFieldNameMap.commonError]: Yup.object({
    [FormFieldNameMap.isExceededAdditionalEquipmentsLimit]: Yup.bool().test(
      'isExceededAdditionalEquipmentsLimit',
      value => !value,
    ),
    [FormFieldNameMap.isExceededDealerAdditionalServicesLimit]: Yup.bool().test(
      'isExceededDealerAdditionalServicesLimit',
      value => !value,
    ),
    [FormFieldNameMap.isExceededBankAdditionalServicesLimit]: Yup.bool().test(
      'isExceededBankAdditionalServicesLimit',
      value => !value,
    ),
    [FormFieldNameMap.isHasNotCascoOption]: Yup.bool().test('isHasNotCascoOption', value => !value),
  }),
}
