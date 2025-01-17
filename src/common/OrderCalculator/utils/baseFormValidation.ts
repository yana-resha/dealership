import * as Yup from 'yup'
import { AnyObject, InternalOptions } from 'yup/lib/types'

import { FieldMessages } from 'shared/constants/fieldMessages'
import { stringToNumber } from 'shared/utils/stringToNumber'

import { CASCO_OPTION_ID } from '../config'
import {
  CommonError,
  FormFieldNameMap,
  FullOrderCalculatorFields,
  BriefOrderCalculatorFields,
} from '../types'
import { setRequiredIfHasProductType } from '../ui/OrderCalculator/FullOrderCalculator/FormContainer/BankDetails/bankDetailsFormValidation.utils'

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

export const bankAdditionalServiceBaseValidation = (checkFn: (commonError: CommonError) => void) => ({
  ...additionalServiceBaseValidation(checkFn),
  [FormFieldNameMap.tariff]: setRequiredIfHasProductType(Yup.string().nullable()),
  [FormFieldNameMap.loanTerm]: setRequiredIfHasProductType(
    Yup.number()
      .nullable()
      .test('isHighTerm', 'Выберите срок меньше или равный сроку кредита', (value, context) => {
        const { loanTerm } =
          ((context.options as InternalOptions)?.from?.[1].value as
            | BriefOrderCalculatorFields
            | FullOrderCalculatorFields) || {}

        if (!value || !loanTerm) {
          return true
        }

        return value <= loanTerm
      }),
  ),
})

type YupBaseSchema<T> = Yup.BaseSchema<T, AnyObject, T>
export function setRequiredIfNecessaryCasco<T extends YupBaseSchema<string | number | undefined | null>>(
  schema: T,
  message?: string,
) {
  return schema.when([FormFieldNameMap.productType], {
    is: (productType: string) => productType === CASCO_OPTION_ID,
    then: schema =>
      schema.test(
        'isHasNotCascoLimit',
        message || FieldMessages.required,
        (value, context) =>
          !(context.options as InternalOptions)?.from?.[1].value.validationParams.isNecessaryCasco || !!value,
      ),
  })
}

export function checkIsLowCascoLimit<T extends YupBaseSchema<string | undefined>>(
  schema: T,
  message?: string,
) {
  return setRequiredIfNecessaryCasco(
    schema.test(
      'isLowCascoLimit',
      message || 'Сумма покрытия должна быть больше или равна сумме залога',
      (value, context) => {
        if (!value) {
          return true
        }
        const { carCost, additionalEquipments = [] } =
          ((context.options as InternalOptions)?.from?.[1].value as
            | BriefOrderCalculatorFields
            | FullOrderCalculatorFields) || {}
        const additionalEquipmentsPrice = additionalEquipments.reduce(
          (acc, cur) => (cur.productType ? acc + (stringToNumber(cur.productCost) ?? 0) : acc),
          0,
        )

        return parseFloat(value) >= (stringToNumber(carCost) ?? 0) + additionalEquipmentsPrice
      },
    ),
  )
}

export const baseFormValidation = {
  [FormFieldNameMap.carCondition]: Yup.number().required(FieldMessages.required),
  [FormFieldNameMap.carBrand]: Yup.string().nullable().required(FieldMessages.required),
  [FormFieldNameMap.carModel]: Yup.string().nullable().required(FieldMessages.required),
  [FormFieldNameMap.carYear]: Yup.number().nullable().required(FieldMessages.required),
  [FormFieldNameMap.carCost]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.carMileage]: Yup.number().when([FormFieldNameMap.carCondition], {
    is: (carCondition: number) => !carCondition,
    then: schema => schema.required(FieldMessages.required).moreThan(0, FieldMessages.moreThanZero),
  }),
  [FormFieldNameMap.GOVERNMENT_PROGRAM]: Yup.string()
    .nullable()
    .when([FormFieldNameMap.IS_GOVERNMENT_PROGRAM, FormFieldNameMap.IS_DFO_PROGRAM], {
      is: (isGovernmentProgram: boolean, isDfoProgram: boolean) => isGovernmentProgram || isDfoProgram,
      then: schema =>
        schema
          .test(
            'isCurrentGovProgramNotFoundInList',
            'Ранее выбранныая гос.программа не подходит по параметрам',
            (value, context) =>
              !(context.options as InternalOptions)?.from?.[0].value.commonError
                .isCurrentGovProgramNotFoundInList,
          )
          .required(FieldMessages.required),
    }),

  [FormFieldNameMap.creditProduct]: Yup.string()
    .nullable()
    .test(
      'isCurrentCreditProductNotFoundInList',
      'Ранее выбранныый кредитный продукт не подходит по параметрам',
      (value, context) =>
        !(context.options as InternalOptions)?.from?.[0].value.commonError
          .isCurrentCreditProductNotFoundInList,
    ),
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
  [FormFieldNameMap.loanTerm]: Yup.number().nullable().required(FieldMessages.required),
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
