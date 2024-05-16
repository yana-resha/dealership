import { object, string } from 'yup'

import { FieldMessages } from 'shared/constants/fieldMessages'

import { loginValidation } from '../config'
import { FormFieldMap } from '../types'

export const loginFormValidationSchema = object({
  [FormFieldMap.LOGIN]: loginValidation,
  [FormFieldMap.PASSWORD]: string().required(FieldMessages.required).min(5, FieldMessages.enterFullData),
})
