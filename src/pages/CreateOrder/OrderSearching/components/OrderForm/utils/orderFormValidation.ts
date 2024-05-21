import * as Yup from 'yup'

import { getMaxBirthDate, getMinBirthDate } from 'pages/CreateOrder/CreateOrder.utils'
import { MIN_AGE } from 'shared/config/client.config'
import { FieldMessages } from 'shared/constants/fieldMessages'

const FILL_ONE_OF_FIELDS_MESSAGE = 'Заполните одно поле или более из оставшихся'

export const searchingOrderFormValidationSchema = Yup.object().shape(
  {
    passport: Yup.string()
      .min(10, 'Введите данные полностью')
      .when(['clientLastName', 'clientFirstName', 'birthDate', 'phoneNumber'], {
        is: (...args: (string | Date | undefined)[]) =>
          args.filter(a => (typeof a === 'string' ? !!a?.trim?.() : !!a)).length >= 2,
        otherwise: schema => schema.required(FILL_ONE_OF_FIELDS_MESSAGE),
      }),
    clientLastName: Yup.string().when(['passport', 'birthDate', 'phoneNumber'], {
      is: (passport: string | undefined, birthDate: string | undefined, phoneNumber: Date | undefined) =>
        passport || (birthDate && phoneNumber),
      otherwise: schema => schema.required(FILL_ONE_OF_FIELDS_MESSAGE),
    }),
    clientFirstName: Yup.string().when(['passport', 'birthDate', 'phoneNumber'], {
      is: (passport: string | undefined, birthDate: string | undefined, phoneNumber: Date | undefined) =>
        passport || (birthDate && phoneNumber),
      otherwise: schema => schema.required(FILL_ONE_OF_FIELDS_MESSAGE),
    }),
    birthDate: Yup.date()
      .min(
        getMinBirthDate(),
        'Для указанного возраста клиента отсутствуют действующие программы автокредитования',
      )
      .max(getMaxBirthDate(), `Минимальный возраст ${MIN_AGE} год`)
      .when(['passport', 'clientLastName', 'clientFirstName', 'phoneNumber'], {
        is: (
          passport: string | undefined,
          clientLastName: string | undefined,
          clientFirstName: string | undefined,
          phoneNumber: Date | undefined,
        ) => passport || (clientLastName?.trim?.() && clientFirstName?.trim?.() && phoneNumber),
        otherwise: schema => schema.required(FILL_ONE_OF_FIELDS_MESSAGE),
      })
      .nullable(),
    phoneNumber: Yup.string()
      .min(11, 'Введите номер полностью')
      .when(['passport', 'clientLastName', 'clientFirstName', 'birthDate'], {
        is: (
          passport: string | undefined,
          clientLastName: string | undefined,
          clientFirstName: string | undefined,
          birthDate: Date | undefined,
        ) => passport || (clientLastName?.trim?.() && clientFirstName?.trim?.() && birthDate),
        otherwise: schema => schema.required(FILL_ONE_OF_FIELDS_MESSAGE),
      }),
  },
  [
    ['passport', 'clientLastName'],
    ['passport', 'clientFirstName'],
    ['passport', 'birthDate'],
    ['passport', 'phoneNumber'],
    ['clientLastName', 'birthDate'],
    ['clientLastName', 'phoneNumber'],
    ['clientFirstName', 'birthDate'],
    ['clientFirstName', 'phoneNumber'],
    ['birthDate', 'phoneNumber'],
  ],
)

export const orderFormValidationSchema = Yup.object().shape({
  clientLastName: Yup.string().required(FieldMessages.required),
  clientFirstName: Yup.string().required(FieldMessages.required),
  passport: Yup.string().required(FieldMessages.required).min(10, 'Введите данные полностью'),
  birthDate: Yup.date()
    .nullable()
    .required(FieldMessages.required)
    .min(
      getMinBirthDate(),
      'Для указанного возраста клиента отсутствуют действующие программы автокредитования',
    )
    .max(getMaxBirthDate(), `Минимальный возраст ${MIN_AGE} год`),
  phoneNumber: Yup.string().required(FieldMessages.required).min(11, 'Введите номер полностью'),
})
