import * as Yup from 'yup'

import {
  clientNameIsCorrect,
  clientNameIsCorrectOptional,
  getMaxBirthDate,
  getMinBirthDate,
  MIN_AGE,
} from 'shared/utils/clientFormValidation'

const FILL_ONE_OF_FIELDS_MESSAGE = 'Заполните одно поле или более из оставшихся'
const REQUIRED_FIELD_MESSAGE = 'Поле обязательно для заполнения'

export const searchingOrderFormValidationSchema = Yup.object().shape(
  {
    passport: Yup.string()
      .min(10, 'Введите данные полностью')
      .when(['clientName', 'birthDate', 'phoneNumber'], {
        is: (...args: (string | Date | undefined)[]) => args.filter(a => !!a).length >= 2,
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
          passport || (clientName && phoneNumber),
        otherwise: schema => schema.required(FILL_ONE_OF_FIELDS_MESSAGE),
      }),
    phoneNumber: Yup.string()
      .min(9, 'Введите номер полностью')
      .when(['passport', 'clientName', 'birthDate'], {
        is: (passport: string | undefined, clientName: string | undefined, birthDate: Date | undefined) =>
          passport || (clientName && birthDate),
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
    .required(REQUIRED_FIELD_MESSAGE)
    .test('nameIsCorrect', 'Введите корректное ФИО', clientNameIsCorrect),
  passport: Yup.string().required(REQUIRED_FIELD_MESSAGE).min(10, 'Введите данные полностью'),
  birthDate: Yup.date()
    .required(REQUIRED_FIELD_MESSAGE)
    .min(getMinBirthDate(), 'Превышен максимальный возраст')
    .max(getMaxBirthDate(), `Минимальный возраст ${MIN_AGE} год`),
  phoneNumber: Yup.string().required(REQUIRED_FIELD_MESSAGE).min(9, 'Введите номер полностью'),
})
