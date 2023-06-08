import * as Yup from 'yup'

import { FieldMessages } from 'shared/constants/fieldMessages'
import {
  clientNameIsCorrect,
  clientNameIsCorrectOptional,
  getMaxBirthDate,
  getMinBirthDate,
  MIN_AGE,
} from 'shared/utils/clientFormValidation'

const FILL_ONE_OF_FIELDS_MESSAGE = 'Заполните одно поле или более из оставшихся'

export const searchingOrderFormValidationSchema = Yup.object().shape(
  {
    passport: Yup.string()
      .min(10, 'Введите данные полностью')
      .when(['clientName', 'birthDate', 'phoneNumber'], {
        is: (...args: (string | Date | undefined)[]) =>
          args.filter(a => (typeof a === 'string' ? !!a?.trim?.() : !!a)).length >= 2,
        otherwise: schema => schema.required(FILL_ONE_OF_FIELDS_MESSAGE),
      }),
    clientName: Yup.string()
      .test('nameIsCorrect', 'Введите корректное ФИО', clientNameIsCorrectOptional)
      .when(['passport', 'birthDate', 'phoneNumber'], {
        is: (passport: string | undefined, birthDate: string | undefined, phoneNumber: Date | undefined) =>
          passport || (birthDate && phoneNumber),
        otherwise: schema => schema.required(FILL_ONE_OF_FIELDS_MESSAGE),
      }),
    birthDate: Yup.date()
      .min(getMinBirthDate(), 'Превышен максимальный возраст')
      .max(getMaxBirthDate(), `Минимальный возраст ${MIN_AGE} год`)
      .when(['passport', 'clientName', 'phoneNumber'], {
        is: (passport: string | undefined, clientName: string | undefined, phoneNumber: Date | undefined) =>
          passport || (clientName?.trim?.() && phoneNumber),
        otherwise: schema => schema.required(FILL_ONE_OF_FIELDS_MESSAGE),
      })
      .nullable()
      .default(null),
    phoneNumber: Yup.string()
      .min(9, 'Введите номер полностью')
      .when(['passport', 'clientName', 'birthDate'], {
        is: (passport: string | undefined, clientName: string | undefined, birthDate: Date | undefined) =>
          passport || (clientName?.trim?.() && birthDate),
        otherwise: schema => schema.required(FILL_ONE_OF_FIELDS_MESSAGE),
      }),
  },
  [
    ['passport', 'clientName'],
    ['passport', 'birthDate'],
    ['passport', 'phoneNumber'],
    ['clientName', 'birthDate'],
    ['clientName', 'phoneNumber'],
    ['birthDate', 'phoneNumber'],
  ],
)

export const orderFormValidationSchema = Yup.object().shape({
  clientName: Yup.string()
    .required(FieldMessages.required)
    .test('nameIsCorrect', 'Введите корректное ФИО', clientNameIsCorrect),
  passport: Yup.string().required(FieldMessages.required).min(10, 'Введите данные полностью'),
  birthDate: Yup.date()
    .required(FieldMessages.required)
    .min(getMinBirthDate(), 'Превышен максимальный возраст')
    .max(getMaxBirthDate(), `Минимальный возраст ${MIN_AGE} год`),
  phoneNumber: Yup.string().required(FieldMessages.required).min(9, 'Введите номер полностью'),
})
