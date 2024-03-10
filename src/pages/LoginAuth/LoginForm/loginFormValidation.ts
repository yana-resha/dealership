import * as Yup from 'yup'

import { FieldMessages } from 'shared/constants/fieldMessages'

import { FormFieldMap } from '../types'

export const loginFormValidationSchema = Yup.object({
  [FormFieldMap.login]: Yup.string().required(FieldMessages.required).min(5, FieldMessages.enterFullData),
  [FormFieldMap.password]: Yup.string().required(FieldMessages.required).min(5, FieldMessages.enterFullData),
})
