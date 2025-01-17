import * as Yup from 'yup'
import { InternalOptions } from 'yup/lib/types'

import { CAR_PASSPORT_TYPE, CASCO_OPTION_ID } from 'common/OrderCalculator/config'
import { FormFieldNameMap, FullOrderCalculatorFields } from 'common/OrderCalculator/types'
import {
  additionalServiceBaseValidation,
  bankAdditionalServiceBaseValidation,
  baseFormValidation,
  checkAdditionalEquipmentsLimit,
  checkBankAdditionalServicesLimit,
  checkDealerAdditionalServicesLimit,
  checkIsLowCascoLimit,
  setRequiredIfNecessaryCasco,
} from 'common/OrderCalculator/utils/baseFormValidation'
import { ServicesGroupName } from 'entities/applications/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { FieldMessages } from 'shared/constants/fieldMessages'

import {
  bankDetailsFormValidation,
  requiredBankDetailsFormValidation,
  setRequiredIfHasProductType,
  setRequiredIfInCredit,
} from './FormContainer/BankDetails/bankDetailsFormValidation.utils'

const WMI_LENGTH = 3

function checkForCarCreationDate(value: Date | null | undefined, context: Yup.TestContext) {
  const carYear = context.parent[FormFieldNameMap.carYear] as string | undefined
  if (!value || !carYear) {
    return true
  }

  return parseInt(carYear, 10) <= value.getFullYear()
}

function checkWIN(value: string | undefined, context: Yup.TestContext) {
  const WMIs = context.parent[FormFieldNameMap.validationParams].WMIs as string[] | undefined
  if (!WMIs || !WMIs.length || !value || value.length < WMI_LENGTH) {
    return true
  }

  return WMIs.includes(value.slice(0, WMI_LENGTH))
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
    .min(17, FieldMessages.vinError)
    .when([FormFieldNameMap.IS_GOVERNMENT_PROGRAM, FormFieldNameMap.IS_DFO_PROGRAM], {
      is: (isGovernmentProgram: boolean, isDfoProgram: boolean) => isGovernmentProgram || isDfoProgram,
      then: schema => schema.test('isWrongWIN', 'Данный WIN не участвует в ГП', checkWIN),
    }),
  [FormFieldNameMap.salesContractId]: Yup.string().required(FieldMessages.required),
  [FormFieldNameMap.salesContractDate]: Yup.date()
    .nullable()
    .required(FieldMessages.required)
    .test('', 'Дата ДКП не может превышать дату выпуска автомобиля', checkForCarCreationDate),
  [FormFieldNameMap.legalPersonCode]: Yup.string().required(FieldMessages.required),

  ...requiredBankDetailsFormValidation,

  [ServicesGroupName.additionalEquipments]: Yup.array().of(
    Yup.object().shape({
      ...additionalServiceBaseValidation(checkAdditionalEquipmentsLimit),

      [FormFieldNameMap.documentType]: setRequiredIfInCredit(
        Yup.number()
          .nullable()
          .test('', FieldMessages.required, (value: number | null | undefined) => value !== 0),
      ),
      [FormFieldNameMap.documentNumber]: setRequiredIfInCredit(Yup.string().nullable()),
      [FormFieldNameMap.documentDate]: setRequiredIfInCredit(Yup.string().nullable()),
      [FormFieldNameMap.broker]: setRequiredIfInCredit(Yup.string().nullable()),

      ...bankDetailsFormValidation,
    }),
  ),

  [ServicesGroupName.dealerAdditionalServices]: Yup.array().of(
    Yup.object().shape({
      ...additionalServiceBaseValidation(checkDealerAdditionalServicesLimit),

      [FormFieldNameMap.documentType]: setRequiredIfNecessaryCasco(
        setRequiredIfInCredit(
          Yup.number()
            .nullable()
            .test('', FieldMessages.required, (value: number | null | undefined) => value !== 0),
        ),
      ),
      [FormFieldNameMap.documentNumber]: setRequiredIfNecessaryCasco(setRequiredIfInCredit(Yup.string())),
      [FormFieldNameMap.documentDate]: setRequiredIfNecessaryCasco(
        setRequiredIfInCredit(Yup.string().nullable()),
      ),
      [FormFieldNameMap.provider]: setRequiredIfInCredit(
        Yup.string()
          .nullable()
          .when([FormFieldNameMap.productType], {
            is: (productType: string) => productType === CASCO_OPTION_ID,
            then: schema => schema.required(FieldMessages.required),
          }),
      ),
      [FormFieldNameMap.broker]: setRequiredIfInCredit(Yup.string().nullable()),
      [FormFieldNameMap.loanTerm]: setRequiredIfNecessaryCasco(
        setRequiredIfInCredit(
          Yup.number()
            .nullable()
            .test('isHighTerm', 'Выберите срок меньше или равный сроку кредита', (value, context) => {
              const { loanTerm } =
                ((context.options as InternalOptions)?.from?.[1].value as FullOrderCalculatorFields) || {}

              if (!value || !loanTerm) {
                return true
              }

              return value <= loanTerm
            }),
        ),
      ),

      ...bankDetailsFormValidation,

      [FormFieldNameMap.cascoLimit]: checkIsLowCascoLimit(Yup.string()),
    }),
  ),

  [ServicesGroupName.bankAdditionalServices]: Yup.array().of(
    Yup.object().shape({
      ...bankAdditionalServiceBaseValidation(checkBankAdditionalServicesLimit),
      [FormFieldNameMap.provider]: setRequiredIfHasProductType(Yup.string().nullable()),
    }),
  ),
})
