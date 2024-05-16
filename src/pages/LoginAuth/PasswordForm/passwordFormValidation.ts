import { object, string } from 'yup'
import { InternalOptions } from 'yup/lib/types'

import { FieldMessages } from 'shared/constants/fieldMessages'

import { FormFieldMap } from '../types'

export const passwordFormValidationSchema = object({
  [FormFieldMap.CODE]: string().required(FieldMessages.required),
  [FormFieldMap.PASSWORD]: string()
    .required(FieldMessages.required)
    .min(12, 'Необходимая длина пароля - 12 символов')
    .test('isNotValidPassword', (value, context) => {
      const cyrillicCharactersRegex = /[а-яА-ЯёЁ]/
      const specialCharactersRegex = /[!@#$%^&*]/
      const digitalCharactersRegex = /[0-9]/
      const letterCharactersRegex = /(?=.*[a-z])(?=.*[A-Z])/

      if (cyrillicCharactersRegex.test(value || '')) {
        return context.createError({ message: 'Допустимо использовать только латинский алфавит' })
      }
      if (!specialCharactersRegex.test(value || '')) {
        return context.createError({ message: 'Необходимо наличие хотя бы одного специального символа' })
      }
      if (!digitalCharactersRegex.test(value || '')) {
        return context.createError({ message: 'Необходимо наличие хотя бы одной цифры' })
      }
      if (!letterCharactersRegex.test(value || '')) {
        return context.createError({ message: 'Необходимо наличие букв разных регистров' })
      }

      return true
    }),

  [FormFieldMap.CONTROL_PASSWORD]: string().test(
    'isNotEqual',
    'Пароли должны совпадать',
    (value, context) => (context.options as InternalOptions).from?.[0].value.password === value,
  ),
})
